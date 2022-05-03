import { MoveNotPossibleError, SubmitMovesNotPossibleError } from './types';

export const getMoveNotPossibleError = (
  reason: MoveNotPossibleError['content']['reason']
): MoveNotPossibleError => ({
  type: 'MoveNotPossible',
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
