import { PieceFactory } from './types';

export const getPieceFactory =
  (factory: PieceFactory) =>
  (...args: Parameters<PieceFactory>) =>
    factory(...args);
