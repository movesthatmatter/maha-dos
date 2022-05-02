import { Color } from '../gameMechanics/util/types';
import { PieceDynamicProps } from '../gameMechanics/Piece/types';

export const generateDefaultRook = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'R',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 15,
    canDie: true,
    canAttack: true,
    attackDamage: 3,
    attackRange: 6,
    hitPoints: 15,
    moveRange: 4,
    ...props
  };
};

export const generateDefaultBishop = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'B',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 10,
    canDie: true,
    canAttack: true,
    attackDamage: 3,
    attackRange: 6,
    hitPoints: 10,
    moveRange: 5,
    ...props
  };
};

export const generateDefaultKnight = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'N',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 12,
    canDie: true,
    canAttack: true,
    attackDamage: 2,
    attackRange: 1,
    hitPoints: 12,
    moveRange: 1,
    ...props
  };
};

export const generateDefaultQueen = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'Q',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 20,
    canDie: true,
    canAttack: true,
    attackDamage: 4,
    attackRange: 7,
    hitPoints: 20,
    moveRange: 7,
    ...props
  };
};

export const generateDefaultPawn = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'P',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 6,
    canDie: true,
    canAttack: true,
    attackDamage: 1,
    attackRange: 1,
    hitPoints: 6,
    moveRange: props?.pieceHasMoved ? 1 : 2,
    ...props
  };
};

export const generateDefaultKing = (
  id: string,
  color: Color,
  props?: Partial<PieceDynamicProps>
) => {
  return {
    label: 'K',
    id,
    color,
    movesDirections: [],
    maxHitPoints: 3,
    canDie: false,
    canAttack: true,
    attackDamage: 5,
    attackRange: 1,
    hitPoints: 3,
    moveRange: 1,
    ...props
  };
};

export const generate = {
  generateDefaultBishop,
  generateDefaultKing,
  generateDefaultKnight,
  generateDefaultPawn,
  generateDefaultQueen,
  generateDefaultRook
};
