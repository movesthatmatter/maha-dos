import { Err, Ok, Result } from 'ts-results';
import { Color } from '../util/types';
import { Game } from './Game';
import {
  GameStateNotInMovePhaseError,
  GameStateNotInAttackPhaseError,
  SubmitMovesNotPossibleError,
  SubmitAttacksNotPossibleError,
  getSubmitMovesNotPossibleError
} from './errors';
import {
  Attack,
  GameStateCompleted,
  GameStateInAttackPhaseWithPartialSubmission,
  GameStateInAtttackPhaseWithNoSubmission,
  GameStateInMovePhaseWithNoSubmission,
  GameStateInMovePhaseWithPartialSubmission,
  isGameInMovePhase,
  isGameInMovePhaseWithPartialSubmission,
  Move,
  PartialGameTurn,
  ShortMove
} from './types';
import { toOppositeColor } from '../util/game';

export interface GameReconciliator extends Game {
  submitMoves(p: { color: Color; moves: Move[] }): Result<
    | GameStateInMovePhaseWithPartialSubmission
    | GameStateInAtttackPhaseWithNoSubmission,
    SubmitMovesNotPossibleError // TODO: add any other possible error such as Moves Already Submitted for Color
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

  // TODO: The Reconciliator is tasked with also checking if the king has died, thus the game is over!
  reconcileAttacks(
    whiteAttacks: Attack[],
    blackAttack: Attack[]
  ): Result<
    GameStateInMovePhaseWithNoSubmission | GameStateCompleted,
    SubmitAttacksNotPossibleError
  >;
}

export class GameReconciliator extends Game implements GameReconciliator {
  submitMoves({
    color,
    moves
  }: {
    color: Color;
    moves: ShortMove[];
  }): Result<
    | GameStateInMovePhaseWithPartialSubmission
    | GameStateInAtttackPhaseWithNoSubmission,
    SubmitMovesNotPossibleError
  > {
    if (!(this.state.state === 'pending' || isGameInMovePhase(this.state))) {
      return new Err(getSubmitMovesNotPossibleError('GameNotInMovePhase'));
    }

    const prevGame = this.state;
    const oppositeColor = toOppositeColor(color);

    if (
      isGameInMovePhaseWithPartialSubmission(prevGame) &&
      prevGame[color].canDraw
    ) {
      // TODO: This shouldn't have to be recasted as the canDraw check above should suffice
      //  but for some reason the compiler doesn't see it
      const oppositeColorMoves = prevGame[oppositeColor].moves as ShortMove[];

      const currentColorMoves = moves;

      const oppositeColorMovesRes = this.board.moveMultiple(oppositeColorMoves);

      if (!oppositeColorMovesRes.ok) {
        return new Err(getSubmitMovesNotPossibleError('InvalidMoves'));
      }

      const currentColorMovesRes = this.board.moveMultiple(currentColorMoves);

      if (!currentColorMovesRes.ok) {
        return new Err(getSubmitMovesNotPossibleError('InvalidMoves'));
      }

      const nextGameTurn: PartialGameTurn = [
        color === 'white'
          ? {
              white: currentColorMovesRes.val,
              black: oppositeColorMovesRes.val
            }
          : {
              white: oppositeColorMovesRes.val,
              black: currentColorMovesRes.val
            }
      ];

      const nextState: GameStateInAtttackPhaseWithNoSubmission = {
        ...prevGame,
        phase: 'attack',
        submissionStatus: 'none',
        history: [...prevGame.history, nextGameTurn],
        white: {
          canDraw: true,
          attacks: undefined
        },
        black: {
          canDraw: true,
          attacks: undefined
        },
        boardState: this.board.state
      };

      const { boardState, ...nextPartialState } = nextState;

      this.partialState = nextPartialState;

      return new Ok(nextState);
    }

    const nextState: GameStateInMovePhaseWithPartialSubmission = {
      ...prevGame,
      state: 'inProgress',
      phase: 'move',
      winner: undefined,
      submissionStatus: 'partial',
      ...(color === 'white'
        ? {
            white: {
              canDraw: false,
              moves
            },
            black: {
              canDraw: true,
              moves: undefined
            }
          }
        : {
            white: {
              canDraw: true,
              moves: undefined
            },
            black: {
              canDraw: false,
              moves
            }
          })
    };

    const { boardState, ...nextPartialState } = nextState;

    this.partialState = nextPartialState;

    return new Ok(nextState);
  }
}
