import { IdentifiablePieceState } from '../Piece/types';
import { Coord } from '../util/types';
import {
  flipMatrixHorizontally,
  getMatrixRowsLength,
  Matrix,
  matrixMap
} from '../util';
import { BoardState } from './types';
import { mahaPieceRegistry } from '../../mahaDosGame/config';
import { Color } from '../commonTypes';

// Returns the default color at the coord for any chess based games
// TODO: Might need to make it game specific in the future if this is not enough
// export const getInitialPieceColorAtCoord = (
//   pieceLayout: Matrix<unknown>,
//   coord: Coord
// ): Color =>
//   coord.row > getMatrixRowsLength(pieceLayout) / 2 ? 'white' : 'black';

export const boardMap = <T>(
  board: BoardState,
  fn: (coord: Coord, piece: undefined | IdentifiablePieceState<string>) => T
) => {
  // const reversedTerrainState = flipMatrixHorizontally(board.terrainState);
  // const reversedPieceLayout = flipMatrixHorizontally(board.pieceLayoutState);

  // const reversedTerrainState = board.terrainState);
  // const reversedPieceLayout = flipMatrixHorizontally(board.pieceLayoutState);

  return matrixMap(board.terrainState, (_, [row, col]) => {
    const coord = { row, col };

    const piece = board.pieceLayoutState[row][col];

    return fn(coord, piece || undefined);
  });
};

export const boardForEach = (
  board: BoardState,
  fn: (coord: Coord, piece: undefined | IdentifiablePieceState<string>) => void
) => {
  boardMap(board, fn);
};

export const generatePieceLabel = (
  color: Color,
  label: keyof typeof mahaPieceRegistry,
  coord: Coord
): string => {
  return `${color}-${label}-${coord.row}-${coord.col}`;
};

export const toPrintableBoard = (board: BoardState) => {
  return matrixMap(board.pieceLayoutState, (sqOrPiece) => {
    if (sqOrPiece === 0) {
      return 0;
    }

    return `${sqOrPiece.color[0]}${sqOrPiece.label[0]}`;
  });
};

export const toPieceId = (ref: string, { row, col }: Coord) =>
  `${ref}-${row}-${col}`;

export const getRefFromPieceId = (
  id: string
): {
  ref: string;
} => ({ ref: id.slice(0, id.indexOf('-')) });
