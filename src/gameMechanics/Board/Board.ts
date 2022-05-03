import { Err, Ok, Result } from 'ts-results';
import { GameConfigurator, Move, ShortMove } from '../Game/types';
import { Piece } from '../Piece/Piece';
import { PieceRegistry } from '../Piece/types';
import { Terrain } from '../Terrain/Terrain';
import {
  Matrix,
  matrixCreate,
  matrixGet,
  MatrixIndex,
  matrixInsert,
  matrixInsertMany,
  matrixMap,
  matrixReduce
} from '../util';
import { Coord } from '../util/types';
import { BoardState, PieceLayoutState } from './types';

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
          props.terrain.width,
          props.terrain.height,
          0
        ),
        pieceById: {}
      } as PiecesState
    );
  }

  // private indexPieces(pieceLayoutState: PieceLayoutState) {
  //   // return matrixForMap(pieceLayoutState, (pieceOrSquare, [row, col]) => {
  //   //   if (pieceOrSquare === 0) {
  //   //     // Square
  //   //     return;
  //   //   }
  //   //   // Piece
  //   //   this.pieceCoordsByPieceId[pieceOrSquare.id] = { row, col };
  //   // });
  //   // this. =
  // }

  // private getDerivedState() {
  //   const nextTerrainState = this.terrain.state;
  //   const nextPieceLayoutState = matrixMap(this.pieceLayout, (x) =>
  //     x === 0 ? x : x.state
  //   );

  //   return {
  //     state: {
  //       terrainState: nextTerrainState,
  //       pieceLayoutState: nextPieceLayoutState
  //     },
  //     pieceCoordsByPieceId: matrixReduce(
  //       nextPieceLayoutState,
  //       (accum, next, [row, col]) => {
  //         if (next === 0) {
  //           return accum;
  //         }

  //         return {
  //           ...accum,
  //           [next.id]: { row, col }
  //         };
  //       },
  //       {} as Record<string, Coord>
  //     )
  //   };
  // }

  // static getDerivedPieceLayoutFromPieceLayoutState(
  //   pieceLayoutState: PieceLayoutState
  // ) {
  //   const pieceLayout = pieceLayoutState.map(() => {});
  // }

  // private setDerivedState() {
  //   const next = this.getDerivedState();

  //   this._state = next;
  // }

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

  getPieceCoordById(pieceId: string) {
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

    return new Ok(
      moves.map((m, i) => ({
        ...m,
        piece: pieces[i].state
      }))
    );
  }

  // setState<T extends BoardState>(nextGetter: T | ((prev: BoardState) => T)): T {
  //   const prevState = this.state;

  //   const nextState =
  //     typeof nextGetter === 'function' ? nextGetter(prevState) : nextGetter;

  //   nextState.pieceLayoutState;

  //   // const next

  //   // const nextPieceLayoutState = matrixInsertMany(prevState.pieceLayoutState, [
  //   //   // {
  //   //   //   index: [move.from.row, move.from.col],
  //   //   //   nextVal: 0
  //   //   // },
  //   //   // {
  //   //   //   index: [move.to.row, move.to.col],
  //   //   //   nextVal: move.piece
  //   //   // }
  //   // ]);

  //   // const nextPieceState = matrixReduce(
  //   //   nextState.pieceLayoutState,
  //   //   (prev, next, [row, col]) => {
  //   //     if (next === 0) {
  //   //       return prev;
  //   //     }

  //   //     const piece = next;

  //   //     piece

  //   //     // The id gets created by the original Coord, but this is open to change!
  //   //     // const id = `${nextLabel}-${row}-${col}`;
  //   //     // const piece = pieceRegistry[nextLabel](id);

  //   //     const nextLayoutMatrix = matrixInsert(
  //   //       prev.layoutMatrix,
  //   //       [row, col],
  //   //       id
  //   //     );

  //   //     return {
  //   //       pieceById: {
  //   //         ...prev.pieceById,
  //   //         [id]: {
  //   //           piece,
  //   //           coord: { row, col }
  //   //         }
  //   //       },
  //   //       layoutMatrix: nextLayoutMatrix
  //   //     };
  //   //   },
  //   //   {
  //   //     layoutMatrix: matrixCreate(
  //   //       props.terrain.width,
  //   //       props.terrain.height,
  //   //       0
  //   //     ),
  //   //     pieceById: {}
  //   //   } as PiecesState
  //   // )
  //   // this.indexPieces(next.pieceLayoutState);

  //   // const x = this.getDerivedState();

  //   // this._state = next;

  //   // TODO: Add any derivates
  // }

  // TODO: Ensure the state gets refreshed anytime there are updates!
}
