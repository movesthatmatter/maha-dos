import { Err, Ok, Result } from 'ts-results';
import {
  AttackNotPossibleError,
  getAttackNotPossibleError
} from '../Game/errors';
import { IGame } from '../Game/IGame';
import { Piece } from '../Piece/Piece';
import { Terrain } from '../Terrain';
import {
  Matrix,
  matrixCreate,
  matrixGet,
  matrixGetDimensions,
  MatrixIndex,
  matrixInsert,
  matrixInsertMany,
  matrixMap,
  matrixReduce
} from '../util';
import { Coord } from '../util/types';
import { BoardState } from './types';
import { IBoard } from './IBoard';
import { PieceRegistry } from '../Piece/types';
import { GameConfigurator } from '../Game/types';
import { AttackOutcome, Move, ShortAttack, ShortMove } from '../commonTypes';

type PieceMetaMappedById = Record<
  Piece['state']['id'],
  {
    piece: Piece;
    coord: Coord;
  }
>;

type PiecesState = {
  layoutMatrix: Matrix<Piece['state']['id'] | 0>;
  pieceById: PieceMetaMappedById;
};

export class Board<PR extends PieceRegistry> implements IBoard<PR> {
  private terrain: Terrain;

  private piecesState: PiecesState;

  private _cachedState?: BoardState;

  constructor(
    pieceRegistry: PR,
    props: Pick<GameConfigurator<PR>, 'pieceLayout' | 'terrain'>
  ) {
    this.terrain = new Terrain(props.terrain);

    this.piecesState = matrixReduce(
      props.pieceLayout,
      (prev, nextRef, [row, col]) => {
        if (nextRef === 0) {
          return prev;
        }

        // The id gets created by the original Coord, but this is open to change!
        const id = `${nextRef}-${row}-${col}`;
        const piece = pieceRegistry[nextRef](id);

        const nextLayoutMatrix = matrixInsert(
          prev.layoutMatrix,
          [row, col],
          id
        );

        return {
          pieceById: {
            ...prev.pieceById,
            [id]: {
              piece,
              coord: { row, col }
            }
          },
          layoutMatrix: nextLayoutMatrix
        };
      },
      {
        layoutMatrix: matrixCreate(
          props.terrain.height || props.terrain.width,
          props.terrain.width,
          0
        ),
        pieceById: {}
      } as PiecesState
    );
  }

  getPieceByCoord(coord: Coord) {
    const row = this.piecesState.layoutMatrix[coord.row];

    if (!row) {
      return undefined;
    }

    const squareOrPieceId = row[coord.col];

    if (squareOrPieceId === 0) {
      return undefined;
    }

    return this.getPieceById(squareOrPieceId);
  }

  getPieceById(pieceId: string) {
    return this.piecesState.pieceById[pieceId]?.piece;
  }

  getPieceCoordById(pieceId: string): Coord | undefined {
    return this.piecesState.pieceById[pieceId]?.coord;
  }

  // This is done so there are no external updates
  get state(): BoardState {
    if (this._cachedState) {
      return this._cachedState;
    }

    const next = {
      terrainState: this.terrain.state,

      // TODO: This could be cached somehow!
      pieceLayoutState: matrixMap(this.piecesState.layoutMatrix, (p) =>
        p === undefined ? 0 : this.piecesState.pieceById[p]?.piece.state || 0
      )
    };

    this._cachedState = next;

    return next;
  }

  setState(nextState: Partial<BoardState>) {
    const next: BoardState = {
      // ...this.state,

      // TODO: This should probably work through the Terrain Class not set automatically
      terrainState: nextState.terrainState || this.state.terrainState,

      pieceLayoutState:
        nextState.pieceLayoutState || this.state.pieceLayoutState
    };

    const [layoutMatrixRows, layoutMatrixCols] = matrixGetDimensions(
      this.piecesState.layoutMatrix
    );

    this.piecesState = matrixReduce(
      next.pieceLayoutState,
      (prev, next, [row, col]) => {
        if (next === 0) {
          return prev;
        }

        // TODO: This doesn't handle adding a new piece to the layout (i.e. promotion) yet!

        return {
          layoutMatrix: matrixInsert(prev.layoutMatrix, [row, col], next.id),
          pieceById: {
            ...prev.pieceById,
            [next.id]: {
              piece: prev.pieceById[next.id].piece,
              coord: { row, col }
            }
          }
        };
      },
      {
        layoutMatrix: matrixCreate(layoutMatrixRows, layoutMatrixCols, 0),
        pieceById: this.piecesState.pieceById
      } as PiecesState
    );

    this._cachedState = next;
  }

  // Deprecate it in favor of applyMoves, which signifies better that it happens once per turn
  // @deprecate
  move(m: ShortMove): Result<Move, 'MoveNotPossible'> {
    return this.moveMultiple([m])
      .mapErr(() => 'MoveNotPossible' as const)
      .map(([move]) => move);
  }

  // Rename this to applyMoves as it shouldn't happen multipel times
  moveMultiple(moves: ShortMove[]): Result<Move[], 'MovesNotPossible'> {
    // TODO: Ensure the moves are valid!

    const pieces = moves.map((m) =>
      this.getPieceById(
        matrixGet(this.piecesState.layoutMatrix, [m.from.row, m.from.col]) || ''
      )
    );

    const absentPiece = pieces.find((p) => !p);

    if (absentPiece) {
      return new Err('MovesNotPossible');
    }

    this.piecesState.layoutMatrix = matrixInsertMany(
      this.piecesState.layoutMatrix,
      moves.reduce(
        (prev, next, i) => {
          const piece = pieces[i];

          return [
            ...prev,
            {
              index: [next.from.row, next.from.col],
              nextVal: 0
            },
            {
              index: [next.to.row, next.to.col],
              nextVal: piece.state.id
            }
          ];
        },
        [] as {
          index: MatrixIndex;
          nextVal: Piece['state']['id'] | 0;
        }[]
      )
    );

    // Expire the cache!
    this._cachedState = undefined;

    return new Ok(
      moves.map((m, i) => ({
        ...m,
        piece: pieces[i].state
      }))
    );
  }

  // TODO: Test
  applyAttacks(
    game: IGame,
    attacks: ShortAttack[]
  ): Result<AttackOutcome[], AttackNotPossibleError> {
    const attackerPieces = attacks.map((a) =>
      this.getPieceById(
        matrixGet(this.piecesState.layoutMatrix, [a.from.row, a.from.col]) || ''
      )
    );

    const absentAttackerPiece = attackerPieces.find((p) => !p);

    if (absentAttackerPiece) {
      return new Err(getAttackNotPossibleError('AttackerPieceNotExistent'));
    }

    const victimPieces = attacks.map((a) =>
      this.getPieceById(
        matrixGet(this.piecesState.layoutMatrix, [a.to.row, a.to.col]) || ''
      )
    );

    const absentVictimPiece = victimPieces.find((p) => !p);

    if (absentVictimPiece) {
      return new Err(getAttackNotPossibleError('VictimPieceNotExistent'));
    }

    const attacksWithAtackerAndVictimPieces = attacks.map((attack, i) => ({
      attack,
      attacker: attackerPieces[i],
      victim: victimPieces[i]
    }));

    return Result.all(
      ...attacksWithAtackerAndVictimPieces.map((zip) =>
        zip.attacker.calculateAttackOutcome(game, zip.attack)
      )
    )
      .andThen((outcomes) =>
        Result.all(
          new Ok(outcomes),
          this.moveMultiple(
            outcomes
              .filter((outcome) => outcome.hasMoved)
              .map((outcome) => outcome.attack)
          ).mapErr(() => getAttackNotPossibleError('DestinationNotValid'))
        )
      )
      .map(([outcomes]) => {
        // The must refresh!
        this._cachedState = undefined;

        return outcomes;
      });
  }
}
