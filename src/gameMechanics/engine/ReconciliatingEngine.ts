import { Result } from 'ts-results';
import { GameStateNotInMovePhaseError } from './errors';
import { GameStateNotInAttackPhaseError } from './errors';
import { Game } from '../Game/Game';
import { GameStateInAttackPhase, GameStateInMovePhase } from '../Game/types';

// export interface GameReconciliator extends Game {
//   reconcileMoves(
//     whiteMoves: GameStateInMovePhase['nextMoves'],
//     blackMoves: GameStateInMovePhase['nextMoves']
//   ): Result<GameStateInAttackPhase, GameStateNotInMovePhaseError>;

//   reconcileAttacks(
//     whiteAttacks: GameStateInAttackPhase['nextAttacks'],
//     blackAttack: GameStateInAttackPhase['nextAttacks']
//   ): Result<GameStateInMovePhase, GameStateNotInAttackPhaseError>;
// }

export class ReconciliatingEngine {
  reconcileMoves(
    prevState: GameState,
    whiteMoves: GameStateInMovePhase['nextMoves'],
    blackMoves: GameStateInMovePhase['nextMoves']
  ): Result<GameStateInAttackPhase, GameStateNotInMovePhaseError> {
    if (prevState.phase !== 'attack') {
      return new Err({
        type: 'GameStateNotInMovePhase',
        content: undefined
      });
    }

    return new Ok({
      board: {
        ...prevState.board
        // TODO: Actually reconcile
      },
      phase: 'attack',
      nextAttacks: []
    });
  }

  reconcileAttacks(
    prevState: GameState,
    whiteAttacks: GameStateInAttackPhase['nextAttacks'],
    blackAttack: GameStateInAttackPhase['nextAttacks']
  ): Result<GameStateInMovePhase, GameStateNotInAttackPhaseError> {
    if (prevState.phase !== 'attack') {
      return new Err({
        type: 'GameStateNotInAttackPhase',
        content: undefined
      });
    }

    return new Ok({
      board: {
        ...prevState.board
        // TODO: Actually reconcile
      },
      phase: 'move',
      nextMoves: []
    });
  }
}
