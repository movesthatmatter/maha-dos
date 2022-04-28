import { Coord } from '../types';
import { BoardState } from './types';

// // Not sure this is really needed as the Game could just take care of it
export interface Board {
  state: BoardState;

  pieceCoordsByPieceId: {
    [pieceId: string]: Coord;
  };

  constructor(props: BoardState): void;
}
