import { Color, MoveDirection } from '../types';

export type PieceState<L extends string> = {
  label: L; // pawn, knight, bishop, queen, king, but also beserk king and whatever other new ones
  color: Color;
  health: number;
  movesDirections: MoveDirection[];
  range: number;
  canAttack: boolean;
  hitPoints: number;
};

export type IdentifiablePieceState<L extends string> = {
  id: string; // color-pieceName-uniqueNumber
} & PieceState<L>;
