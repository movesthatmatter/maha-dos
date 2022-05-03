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
  isGameInMovePhaseWithNoSubmission,
  isGameInMovePhaseWithPartialSubmission,
  Move
} from './types';

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

export class GameReconciliator implements GameReconciliator {
  submitMoves({
    color,
    moves
  }: {
    color: Color;
    moves: Move[];
  }): Result<
    | GameStateInMovePhaseWithPartialSubmission
    | GameStateInAtttackPhaseWithNoSubmission,
    SubmitMovesNotPossibleError
  > {
    // Specs:
    // Must Be In Move Phase
    // Must Be in No Submision or PartialSubmission
    // If in Partial Submission it Returns GameStateInAtttackPhaseWithNoSubmission otherwise GameStateInMovePhaseWithPartialSubmission

    if (!isGameInMovePhase(this.state)) {
      return new Err(getSubmitMovesNotPossibleError('GameNotInMovePhase'));
    }

    // TODO This could actually do a test to see if the moves were succesful!
    // return Result
    //   .all(...moves.map((m) => this.board.move(m)))
    //   .map(() => {

    //   })
    //   .mapErr(() => {})

    // const prevState = {
    //   ...this.state,
    // }

    const prevGame = this.state;

    if (isGameInMovePhaseWithNoSubmission(prevGame)) {
      const nextState: GameStateInMovePhaseWithPartialSubmission = {
        ...prevGame,
        state: 'inProgress',
        phase: 'move',
        winner: undefined,
        submissionStatus: 'partial',
        // canD
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

    // TODO: Add the other logic for preparing game!
    return new Err(getSubmitMovesNotPossibleError('GameNotInMovePhase'));

    // if (isGameInMovePhaseWithPartialSubmission(this.state)) {
    //   // Returns GameStateInAtttackPhaseWithNoSubmission
    //   // return this.board
    //   // .moveMultiple(moves)
    //   // .mapErr(
    //   //   () =>
    //   //     ({
    //   //       type: 'SubmitMovesNotPossible',
    //   //       reason: 'GameNotInMovePhase',
    //   //       content: undefined
    //   //     } as const)
    //   // )
    //   // .map(() => {
    //   //   this
    //   //   // this.state = nextState;
    //   //   return nextState;
    //   //   // this.state = {
    //   //   //   ...this.state,
    //   //   // }
    //   //   // return this.state;
    //   //   // if (isGameInMovePhaseWithNoSubmission(prevState)) {
    //   //   //   return this.state as GameStateInMovePhaseWithPartialSubmission;
    //   //   // }
    //   //   // return this.state as ;
    //   // });
    // }

    // return this.state;

    // const nextPieceLayoutState = matrixInsertMany(
    //   this.board.state.pieceLayoutState,
    //   moves.reduce<
    //     {
    //       index: [number, number];
    //       nextVal: 0 | IdentifiablePieceState;
    //     }[]
    //   >(
    //     (accum, nextMove) => [
    //       ...accum,
    //       {
    //         index: [nextMove.from.row, nextMove.from.col],
    //         nextVal: 0
    //       },
    //       {
    //         index: [nextMove.to.row, nextMove.to.col],
    //         nextVal: nextMove.piece
    //       }
    //     ],
    //     []
    //   )
    // );

    // this.state.boardState.pieceLayoutState = nextPieceLayoutState;

    // this.board. = {}

    // return
  }
}
