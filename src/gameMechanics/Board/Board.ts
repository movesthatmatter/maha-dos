import { Err, Ok, Result } from 'ts-results';
import { GameConfigurator, Move, ShortMove } from '../Game/types';
import { Piece } from '../Piece/Piece';
import { PieceRegistry } from '../Piece/types';
import { Terrain } from '../Terrain/Terrain';
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

export interface IBoard {
  state: BoardState;

  getPieceById(id: string): Piece | undefined;

  getPieceByCoord(coord: Coord): Piece | undefined;
}

type PieceAndCoordMappedById = Record<
  Piece['state']['id'],
  {
    piece: Piece;
    coord: Coord;
  }
>;

type PiecesState = {
  layoutMatrix: Matrix<Piece['state']['id'] | 0>;
  pieceById: PieceAndCoordMappedById;
};

export class Board<PR extends PieceRegistry> implements IBoard {
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
      (prev, nextLabel, [row, col]) => {
        if (nextLabel === 0) {
          return prev;
        }

        // The id gets created by the original Coord, but this is open to change!
        const id = `${nextLabel}-${row}-${col}`;
        const piece = pieceRegistry[nextLabel](id);

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

  move(m: ShortMove): Result<Move, 'MoveNotPossible'> {
    return this.moveMultiple([m])
      .mapErr(() => 'MoveNotPossible' as const)
      .map(([move]) => move);
  }

  moveMultiple(moves: ShortMove[]): Result<Move[], 'MovesNotPossible'> {
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
}
