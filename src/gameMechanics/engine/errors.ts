export type GameStateNotInMovePhaseError = {
  type: 'GameStateNotInMovePhase';
  content: undefined;
};

export type GameStateNotInAttackPhaseError = {
  type: 'GameStateNotInAttackPhase';
  content: undefined;
};

export type AttackTargetPieceUndefined = {
  type: 'TargetPieceIsUndefined';
  content: undefined;
};
