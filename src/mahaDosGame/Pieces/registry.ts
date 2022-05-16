import { getPieceFactory } from '../../gameMechanics/Piece/util';
import { Bishop } from './Bishop';
import { King } from './King';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { Rook } from './Rook';
import { dark } from './assets';

export const mahaPieceRegistry = {
  wR: getPieceFactory((...args) => new Rook('white', ...args)),
  wN: getPieceFactory((...args) => new Knight('white', ...args)),
  wB: getPieceFactory((...args) => new Bishop('white', ...args)),
  wQ: getPieceFactory((...args) => new Queen('white', ...args)),
  wK: getPieceFactory((...args) => new King('white', ...args)),
  wP: getPieceFactory((...args) => new Pawn('white', ...args)),

  bR: getPieceFactory((...args) => new Rook('black', ...args)),
  bN: getPieceFactory((...args) => new Knight('black', ...args)),
  bB: getPieceFactory((...args) => new Bishop('black', ...args)),
  bQ: getPieceFactory((...args) => new Queen('black', ...args)),
  bK: getPieceFactory((...args) => new King('black', ...args)),
  bP: getPieceFactory((...args) => new Pawn('black', ...args))
  // Add others if needed
  // BsrKing: BeserkKing maybe
};

export const mahaAssetPieceRegistry = {
  wR: dark.wR,
  wN: dark.wN,
  wB: dark.wB,
  wQ: dark.wQ,
  wK: dark.wK,
  wP: dark.wP,

  bR: dark.bR,
  bN: dark.bN,
  bB: dark.bB,
  bQ: dark.bQ,
  bK: dark.bK,
  bP: dark.bP
};
