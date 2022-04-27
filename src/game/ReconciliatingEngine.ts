import { Err, Ok, Result } from 'ts-results';
import {
  Coord,
  GameState,
  GameStateInAttackPhase,
  GameStateInMovePhase,
  Move,
  IdentifiablePieceProps,
  SerializedGameState,
  GameStateNotInMovePhaseError,
  GameStateNotInAttackPhaseError
} from './types';
import { Piece } from './Pieces/Piece';
import { Terrain } from './terrain';
import { deserializeGameState } from './util';

class ReconciliatingEngine {
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
