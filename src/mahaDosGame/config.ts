import { Rook } from './Pieces/Rook';
import { Knight } from './Pieces/Knight';
import { Pawn } from './Pieces/Pawn';
import { Bishop } from './Pieces/Bishop';
import { Queen } from './Pieces/Queen';
import { King } from './Pieces/King';
import { getPieceFactory } from 'src/gameMechanics/Piece/util';
import { GameConfigurator } from 'src/gameMechanics/Game/types';

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

export const DEFAULT_MAHA_CONFIGURATOR: GameConfigurator<
  typeof mahaPieceRegistry
> = {
  terrain: { width: 8 },
  pieceLayout: [
    ['R', 'N', 'B', 'K', 'Q', 'B', 'K', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'K', 'Q', 'B', 'K', 'R']
  ]
  // TODO: add this dynamic props going to be needed
  // pieceDynamicProps: []
};
