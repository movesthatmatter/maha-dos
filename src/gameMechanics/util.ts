// import { BoardState, PieceProps } from 'src/game/types';
import { BoardState } from './Board/types';
import { Piece } from './Piece/Piece';
import { Coord, Matrix, PieceFactory } from './types';

export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);

// export const getPieceBySquare = ({
//   sq,
//   board
// }: {
//   sq: Coord;
//   board: BoardState['pieceLayoutState'];
// }): PieceProps | undefined => {
//   const piece = board[sq.x][sq.y];
//   return piece !== 0 ? (piece as PieceProps) : undefined;
// };

export const matrixMap = <T, R>(
  matrix: Matrix<T>,
  fn: (t: T, index: [row: number, col: number]) => R
) =>
  matrix.map((row, rowIndex) =>
    row.map((val, colIndex) => fn(val, [rowIndex, colIndex]))
  );

export const matrixForEach = <T>(
  matrix: Matrix<T>,
  fn: (t: T, index: [row: number, col: number]) => void
) => {
  matrixMap(matrix, fn);
};

// Flips a rows
export const flipMatrixHorizontally = <T>(matrix: Matrix<T>) =>
  matrix.reduce((accum, nextRow) => [nextRow, ...accum], [] as Matrix<T>);

export const getMatrixRowsLength = (matrix: Matrix<unknown>) => matrix.length;
export const getMatrixColsLength = (matrix: Matrix<unknown>) =>
  matrix[0]?.length || 0;

export const getPieceFactory =
  (factory: PieceFactory) =>
  (...args: Parameters<PieceFactory>) =>
    factory(...args);

// export const pieceFactory: PieceFactory = () => {}

// TODO: These are just extra for now as it just json stringifies them
//  but what I really care about is the data structures.
// The actual Serialization happens over http at that level
// export const serializeGameState = (s: GameState): SerializedGameState => {
//   // TODO: Ensure this actually gets serialized correctly
//   return JSON.stringify(s) as SerializedGameState;

//   // Could do some nested serializers
//   // return s.board.terrain[0][0].;
// };

// export const isGameState = (obj: object): obj is GameState => {
//   // TODO: Ensure the actual given string is an actual real GameState
//   return !!(isObject(obj) && 'board' in obj && 'phase' in obj);
// };

// export const isSerializedGameState = (
//   str: string
// ): str is SerializedGameState => {
//   try {
//     return isGameState(JSON.parse(str));
//   } catch (_) {
//     return false;
//   }
// };

// export const deserializeGameState = (str: string): Result<GameState, void> => {
//   if (!isSerializedGameState(str)) {
//     return Err.EMPTY;
//   }

//   // Here i reparse the json
//   return new Ok(JSON.parse(str) as GameState);
// };

// export const seralize = <R extends string, T extends object = object>(
//   obj: T
// ): R => {
//   // TODO: Ensure this actually gets serialized correctly
//   return JSON.stringify(obj) as R;
// };
