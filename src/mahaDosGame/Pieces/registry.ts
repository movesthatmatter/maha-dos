import { Piece } from 'src/gameMechanics/Piece/Piece';
import { PieceRegistry } from 'src/gameMechanics/types';
import { Rook } from './Rook';
import { Knight } from './Knight';
import { getPieceFactory } from 'src/gameMechanics/util';

export const mahaPieceRegistry = {
  R: getPieceFactory((...args) => new Rook(...args)),
  N: getPieceFactory((...args) => new Knight(...args)),
  B: getPieceFactory((...args) => ({} as Piece)),
  Q: getPieceFactory((...args) => ({} as Piece)),
  K: getPieceFactory((...args) => ({} as Piece)),
  P: getPieceFactory((...args) => ({} as Piece)),

  // Add others if needed
  // BsrKing: BeserkKing maybe
};
