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
  content: undefined;
};

export type AttackNotPossibleError = {
  type: 'AttackNotPossible';
  content: undefined;
};
