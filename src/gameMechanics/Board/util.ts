import { IdentifiablePieceState } from '../Piece/types';
import { Color, Coord, Matrix } from '../types';
import {
  flipMatrixHorizontally,
  getMatrixRowsLength,
  matrixMap
} from '../util';
import { BoardState } from './types';

// Returns the default color at the coord for any chess based games
// TODO: Might need to make it game specific in the future if this is not enough
export const getInitialPieceColorAtCoord = (
  pieceLayout: Matrix<unknown>,
  coord: Coord
): Color =>
  coord.x > getMatrixRowsLength(pieceLayout) / 2 ? 'black' : 'white';

export const boardMap = <T>(
  board: BoardState,
  fn: (coord: Coord, piece: undefined | IdentifiablePieceState<string>) => T
) => {
  const reversedTerrainState = flipMatrixHorizontally(board.terrainState);
  const reversedPieceLayout = flipMatrixHorizontally(board.pieceLayoutState);

  return matrixMap(reversedTerrainState, (_, [row, col]) => {
    const coord = { x: row, y: col };

    const piece = reversedPieceLayout[row][col];

    return fn(coord, piece || undefined);
  });
};

export const boardForEach = (
  board: BoardState,
  fn: (coord: Coord, piece: undefined | IdentifiablePieceState<string>) => void
) => {
  boardMap(board, fn);
};
