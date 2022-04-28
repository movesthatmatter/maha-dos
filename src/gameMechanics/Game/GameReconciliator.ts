import { Result } from 'ts-results';
import { Color } from '../types';
import { Game } from './Game';
import {
  GameStateNotInMovePhaseError,
  GameStateNotInAttackPhaseError
} from './errorTypes';
import {
  Attack,
  GameStateInAttackPhaseWithPartialSubmission,
  GameStateInAtttackPhaseWithNoSubmission,
  GameStateInMovePhaseWithNoSubmission,
  GameStateInMovePhaseWithPartialSubmission,
  Move
} from './types';

export interface GameReconciliator extends Game {
  submitMoves(p: { color: Color; moves: Move[] }): Result<
    | GameStateInMovePhaseWithPartialSubmission
    | GameStateInAtttackPhaseWithNoSubmission,
    GameStateNotInMovePhaseError // TODO: add any other possible error such as Moves Already Submitted for Color
  >;

  submitAttacks(p: { color: Color; attacks: Attack[] }): Result<
    | GameStateInAttackPhaseWithPartialSubmission
    | GameStateInMovePhaseWithNoSubmission,
    GameStateNotInAttackPhaseError // TODO: add any other possible error such as Attacks Already Submitted for Color
  >;

  reconcileMoves(
    whiteMoves: Move[],
    blackMoves: Move[]
  ): Result<
    GameStateInAtttackPhaseWithNoSubmission,
    GameStateNotInMovePhaseError
  >;

  reconcileAttacks(
    whiteAttacks: Attack[],
    blackAttack: Attack[]
  ): Result<
    GameStateInMovePhaseWithNoSubmission,
    GameStateNotInAttackPhaseError
  >;
}
