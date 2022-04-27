import { BoardState, Coord, PieceProps } from './types';

export class Events {
  constructor() {}

  startPieceDrag(state: BoardState, piece: PieceProps, square: Coord) {}

  stopPieceDrag(state: BoardState, piece: PieceProps, square: Coord) {}

  userCallback<T extends (...args: any[]) => void>(
    fn: T | undefined,
    ...args: Parameters<T>
  ) {
    fn(...args);
  }
}
