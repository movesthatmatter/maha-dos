import {
  AttackNotPossibleError,
  MoveNotPossibleError,
  SubmitAttacksNotPossibleError,
  SubmitMovesNotPossibleError
} from './types';

// TODO: These should be called getDrawMoveNotPossible
export const getMoveNotPossibleError = (
  reason: MoveNotPossibleError['content']['reason']
): MoveNotPossibleError => ({
  type: 'MoveNotPossible',
  content: {
    reason
  }
});

// TODO: These should be called getDrawAttackNotPossible
export const getAttackNotPossibleError = (
  reason: AttackNotPossibleError['content']['reason']
): AttackNotPossibleError => ({
  type: 'AttackNotPossible',
  content: {
    reason
  }
});

export const getSubmitMovesNotPossibleError = (
  reason: SubmitMovesNotPossibleError['reason']
): SubmitMovesNotPossibleError => ({
  type: 'SubmitMovesNotPossible',
  reason,
  content: undefined
});

export const getSubmitAttacksNotPossibleError = (
  reason: SubmitAttacksNotPossibleError['reason']
): SubmitAttacksNotPossibleError => ({
  type: 'SubmitAttacksNotPossible',
  reason,
  content: undefined
});
