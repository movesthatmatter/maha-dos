import {
  GameState,
  GameStateInAttackPhase,
  GameStateInAttackPhaseWithPartialSubmission,
  GameStateInAttackPhaseWithPreparingSubmission,
  GameStateInAtttackPhaseWithNoSubmission,
  GameStateInMovePhase,
  GameStateInMovePhaseWithPartialSubmission,
  GameStateInMovePhaseWithPreparingSubmission
} from './types';

export const isGameInMovePhase = (g: GameState): g is GameStateInMovePhase =>
  g.state === 'inProgress' && g.phase === 'move';

export const isGameInMovePhaseWithNoSubmission = (
  g: GameState
): g is GameStateInMovePhaseWithPreparingSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'move' &&
    g.submissionStatus === 'none'
  );
};

export const isGameInMovePhaseWithPreparingSubmission = (
  g: GameState
): g is GameStateInMovePhaseWithPreparingSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'move' &&
    g.submissionStatus === 'preparing'
  );
};

export const isGameInMovePhaseWithPartialSubmission = (
  g: GameState
): g is GameStateInMovePhaseWithPartialSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'move' &&
    g.submissionStatus === 'partial'
  );
};

export const isGameInMovePhaseWithPartialOrPreparingSubmission = (
  g: GameState
): g is
  | GameStateInMovePhaseWithPreparingSubmission
  | GameStateInMovePhaseWithPartialSubmission => {
  return (
    isGameInMovePhaseWithPreparingSubmission(g) ||
    isGameInMovePhaseWithPartialSubmission(g)
  );
};

export const isGameInAttackPhase = (
  g: GameState
): g is GameStateInAttackPhase =>
  g.state === 'inProgress' && g.phase === 'attack';

export const isGameInAttackPhaseWithNoSubmission = (
  g: GameState
): g is GameStateInAtttackPhaseWithNoSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'attack' &&
    g.submissionStatus === 'none'
  );
};

export const isGameInAttackPhaseWithPreparingSubmission = (
  g: GameState
): g is GameStateInAttackPhaseWithPreparingSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'attack' &&
    g.submissionStatus === 'preparing'
  );
};

export const isGameInAttackPhaseWithPartialSubmission = (
  g: GameState
): g is GameStateInAttackPhaseWithPartialSubmission => {
  return (
    g.state === 'inProgress' &&
    g.phase === 'attack' &&
    g.submissionStatus === 'partial'
  );
};

export const isGameInAttackPhaseWithPartialOrPreparingSubmission = (
  g: GameState
): g is
  | GameStateInAttackPhaseWithPreparingSubmission
  | GameStateInAttackPhaseWithPartialSubmission => {
  return (
    isGameInAttackPhaseWithPreparingSubmission(g) ||
    isGameInAttackPhaseWithPartialSubmission(g)
  );
};
