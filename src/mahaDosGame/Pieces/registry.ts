import { getPieceFactory } from 'src/gameMechanics/Piece/util';
import { Bishop } from './Bishop';
import { King } from './King';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { Rook } from './Rook';

export const mahaPieceRegistry = {
  R: getPieceFactory((...args) => new Rook(...args)),
  N: getPieceFactory((...args) => new Knight(...args)),
  B: getPieceFactory((...args) => new Bishop(...args)),
  Q: getPieceFactory((...args) => new Queen(...args)),
  K: getPieceFactory((...args) => new King(...args)),
  P: getPieceFactory((...args) => new Pawn(...args))

  // Add others if needed
  // BsrKing: BeserkKing maybe
};
