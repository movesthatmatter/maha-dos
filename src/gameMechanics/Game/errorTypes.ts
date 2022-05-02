export type GameStateNotInMovePhaseError = {
  type: 'GameStateNotInMovePhase';
  content: undefined;
};

export type GameStateNotInAttackPhaseError = {
  type: 'GameStateNotInAttackPhase';
  content: undefined;
};

export type MoveNotPossibleError = {
  type: 'MoveNotPossible';
  content: {
    reason:
      | 'GameIsCompleted'
      | 'GameNotInMovePhase'
      | 'PieceNotExistent'
      | 'DestinationNotValid'
      | 'PieceAlreadyMoved';
  };
};

export type AttackNotPossibleError = {
  type: 'AttackNotPossible';
  content: undefined;
};

export const getMoveNotPossibleError = (
  reason: MoveNotPossibleError['content']['reason']
): MoveNotPossibleError => ({
  type: 'MoveNotPossible',
  content: {
    reason
  }
});
