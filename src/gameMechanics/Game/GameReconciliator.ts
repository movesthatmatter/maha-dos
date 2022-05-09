import { Err, Ok, Result } from 'ts-results';
import { Game } from './Game';
import {
  GameStateNotInMovePhaseError,
  SubmitMovesNotPossibleError,
  SubmitAttacksNotPossibleError,
  getSubmitMovesNotPossibleError,
  getSubmitAttacksNotPossibleError
} from './errors';
import {
  GameStateCompleted,
  GameStateInAttackPhaseWithPartialSubmission,
  GameStateInAtttackPhaseWithNoSubmission,
  GameStateInMovePhaseWithNoSubmission,
  GameStateInMovePhaseWithPartialSubmission
} from './types';
import { toOppositeColor } from '../util/game';
import {
  isGameInAttackPhase,
  isGameInAttackPhaseWithPartialSubmission,
  isGameInMovePhase,
  isGameInMovePhaseWithPartialSubmission
} from './helpers';
import { Attack, Color, FullGameTurn, Move, PartialGameTurn, ShortAttack, ShortMove } from '../commonTypes';

export interface GameReconciliator extends Game {
  submitMoves(p: {
    color: Color;
    moves: Move[];
  }): Result<
    | GameStateInMovePhaseWithPartialSubmission
    | GameStateInAtttackPhaseWithNoSubmission,
    SubmitMovesNotPossibleError
  >;

  submitAttacks(p: {
    color: Color;
    attacks: Attack[];
  }): Result<
    | GameStateInAttackPhaseWithPartialSubmission
    | GameStateInMovePhaseWithNoSubmission,
    SubmitAttacksNotPossibleError
  >;

  // TODO: These aren't needed anymore b/c the submit takes care of the reconciliation

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

  // TODO: Test
  submitAttacks({
    color,
    attacks
  }: {
    color: Color;
    attacks: ShortAttack[];
  }): Result<
    | GameStateInAttackPhaseWithPartialSubmission
    | GameStateInMovePhaseWithNoSubmission,
    SubmitAttacksNotPossibleError
  > {
    if (!isGameInAttackPhase(this.state)) {
      return new Err(getSubmitAttacksNotPossibleError('GameNotInAttackPhase'));
    }

    const prevGame = this.state;
    const oppositeColor = toOppositeColor(color);

    if (
      isGameInAttackPhaseWithPartialSubmission(prevGame) &&
      prevGame[color].canDraw
    ) {
      // TODO: This shouldn't have to be recasted as the canDraw check above should suffice
      //  but for some reason the compiler doesn't see it
      const oppositeColorAttacks = prevGame[oppositeColor].attacks as ShortAttack[];
      const currentColorAttacks = attacks;

      const oppositeColorAttacksRes = this.board.applyAttacks(this, oppositeColorAttacks);

      if (!oppositeColorAttacksRes.ok) {
        return new Err(getSubmitAttacksNotPossibleError('InvalidAttacks'));
      }

      const currentColorAttacksRes =
        this.board.applyAttacks(this, currentColorAttacks);

      if (!currentColorAttacksRes.ok) {
        return new Err(getSubmitAttacksNotPossibleError('InvalidAttacks'));
      }

      const prevPartialTurn: PartialGameTurn = prevGame.history.slice(-1)[0];

      const nextGameTurn: FullGameTurn = [
        ...prevPartialTurn as any,
        color === 'white'
          ? {
              white: currentColorAttacksRes.val,
              black: oppositeColorAttacksRes.val
            }
          : {
              white: oppositeColorAttacksRes.val,
              black: currentColorAttacksRes.val
            }
      ];

      const prevHistoryWithoutPartial = prevGame.history.slice(0, -1);

      const nextState: GameStateInMovePhaseWithNoSubmission = {
        ...prevGame,
        phase: 'move',
        submissionStatus: 'none',
        history: [...prevHistoryWithoutPartial, nextGameTurn],
        white: {
          canDraw: true,
          moves: undefined
        },
        black: {
          canDraw: true,
          moves: undefined
        },
        boardState: this.board.state
      };

      const { boardState, ...nextPartialState } = nextState;

      this.partialState = nextPartialState;

      return new Ok(nextState);
    }

    const nextState: GameStateInAttackPhaseWithPartialSubmission = {
      ...prevGame,
      state: 'inProgress',
      phase: 'attack',
      winner: undefined,
      submissionStatus: 'partial',
      ...(color === 'white'
        ? {
            white: {
              canDraw: false,
              attacks
            },
            black: {
              canDraw: true,
              attacks: undefined
            }
          }
        : {
            white: {
              canDraw: true,
              attacks: undefined
            },
            black: {
              canDraw: false,
              attacks
            }
          })
    };

    const { boardState, ...nextPartialState } = nextState;

    this.partialState = nextPartialState;

    return new Ok(nextState);
  }
}
