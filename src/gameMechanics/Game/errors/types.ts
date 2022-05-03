type GameIsCompletedReason = 'GameIsCompleted';
type GameNotInMovePhaseReason = 'GameNotInMovePhase';
type PieceNotExistentReason = 'PieceNotExistent';
type DestinationNotValidReason = 'DestinationNotValid';
type PieceAlreadyMovedReason = 'PieceAlreadyMoved';

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
      | GameIsCompletedReason
      | GameNotInMovePhaseReason
      | PieceNotExistentReason
      | DestinationNotValidReason
      | PieceAlreadyMovedReason;
  };
};

export type AttackNotPossibleError = {
  type: 'AttackNotPossible';
  content: undefined;
};

// I like this type of errors with a reason field b/c they could be easier
//  to catch by type and handle by reason!
// Also, the content could be union tagged by reason!
export type SubmitMovesNotPossibleError = {
  type: 'SubmitMovesNotPossible';
  reason: GameNotInMovePhaseReason;
  content: undefined;
};

export type SubmitAttacksNotPossibleError = {
  type: 'SubmitAttacksNotPossible';
  reason: undefined;
  content: undefined;
};

export type AttackTargetPieceUndefined = {
  type: 'TargetPieceIsUndefined';
  content: undefined;
};