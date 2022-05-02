import { Color, MoveDirection } from '../util/types';
import { Piece } from './Piece';
import { Coord } from '../../gameMechanics/util';

export type PieceStaticProps<L extends string = string> = {
  label: L; // pawn, knight, bishop, queen, king, but also beserk king and whatever other new ones
  movesDirections: MoveDirection[];
  attackDirection?: Coord[];
  color: Color;
  maxHitPoints: number; // static
  canDie: boolean; // If a canDie=false piece runs out of life, game ends!
};

export type PieceDynamicProps = {
  // Move
  moveRange: number;

  // Attack
  attackDamage: number;
  attackRange: number;

  // Health
  hitPoints: number;

  // This depends on wether the piece moved or not
  canAttack: boolean;

  //Check against initial position
  pieceHasMoved?: boolean;

  // TODO: The Attack Bonus or other Special Rules & Crits will come later!
  // bonus?: {
  //   affectedKeys: keyof PieceState<string>;
  //   isActive: boolean;
  // }
};

export type PieceState<L extends string = string> = PieceStaticProps<L> &
  PieceDynamicProps;

export type IdentifiablePieceState<L extends string> = {
  id: string; // color-pieceName-uniqueNumber
} & PieceState<L>;

export type PieceFactory = (
  id: IdentifiablePieceState<'Knight'>['id'],
  dynamicProps?: PieceDynamicProps
) => Piece;

export type PieceRegistry = Record<string, PieceFactory>;
