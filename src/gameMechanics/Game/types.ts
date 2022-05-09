import {
  Color,
  GameHistory,
  GameTurn,
  PartialGameTurnMovePhase,
  ShortAttack,
  ShortMove
} from '../commonTypes';
import { BoardState } from '../Board/types';
import { PieceRegistry } from '../Piece/types';
import { TerrainProps } from '../Terrain/Terrain';
import { Matrix } from '../util';

export type GameStatePending = {
  boardState: BoardState;
  // TODO: This needs to change to stateStatus
  state: 'pending';
  history: [];
  winner: undefined;
};

export type GameWinner = Color | '1/2';

export type GameStateCompleted = {
  boardState: BoardState;

  // TODO: This needs to change to stateStatus
  state: 'completed';
  history: GameHistory;
  winner: GameWinner;
};

export type InProgressGameStatePhaseSlice =
  | ({
      phase: 'move';
      history: GameHistory;
    } & (
      | {
          submissionStatus: 'none';
          white: {
            canDraw: true;
            moves: undefined;
          };
          black: {
            canDraw: true;
            moves: undefined;
          };
        }
      | {
          submissionStatus: 'preparing';
          white: {
            canDraw: true;
            moves: ShortMove[];
          };
          black: {
            canDraw: true;
            moves: ShortMove[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: true;
            moves: undefined;
          };
          black: {
            canDraw: false; // When canDraw is false it means player Submitted
            moves: ShortMove[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: false; // When canDraw is false it means player Submitted
            moves: ShortMove[];
          };
          black: {
            canDraw: true;
            moves: undefined;
          };
        }
    ))
  | ({
      phase: 'attack';
      history: [...GameHistory, PartialGameTurnMovePhase];
    } & (
      | {
          submissionStatus: 'none';
          white: {
            canDraw: true;
            attacks: undefined;
          };
          black: {
            canDraw: true;
            attacks: undefined;
          };
        }
      | {
          submissionStatus: 'preparing';
          white: {
            canDraw: true;
            attacks: ShortAttack[];
          };
          black: {
            canDraw: true;
            attacks: ShortAttack[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: true;
            attacks: undefined;
          };
          black: {
            canDraw: false; // When Can Draw is false it means player Submitted
            attacks: ShortAttack[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: false; // When Can Draw is false it means player Submitted
            attacks: ShortAttack[];
          };
          black: {
            canDraw: true;
            attacks: undefined;
          };
        }
    ));

export type GameStateInProgress = {
  boardState: BoardState;
  // TODO: This needs to change to stateStatus
  state: 'inProgress';
  winner: undefined;
} & InProgressGameStatePhaseSlice;

export type GameState =
  | GameStatePending
  | GameStateInProgress
  | GameStateCompleted;

export type GameStateInMovePhase = Extract<GameState, { phase: 'move' }>;
export type GameStateInMovePhaseWithNoSubmission = Extract<
  GameStateInMovePhase,
  { submissionStatus: 'none' }
>;
export type GameStateInMovePhaseWithPreparingSubmission = Extract<
  GameStateInMovePhase,
  { submissionStatus: 'preparing' }
>;
export type GameStateInMovePhaseWithPartialSubmission = Extract<
  GameStateInMovePhase,
  { submissionStatus: 'partial' }
>;

export type GameStateInAttackPhase = Extract<GameState, { phase: 'attack' }>;
export type GameStateInAtttackPhaseWithNoSubmission = Extract<
  GameStateInAttackPhase,
  { submissionStatus: 'none' }
>;
export type GameStateInAttackPhaseWithPreparingSubmission = Extract<
  GameStateInAttackPhase,
  { submissionStatus: 'preparing' }
>;

export type GameStateInAttackPhaseWithPartialSubmission = Extract<
  GameStateInAttackPhase,
  { submissionStatus: 'partial' }
>;

export type GameConfigurator<PR extends PieceRegistry> = {
  terrain: TerrainProps;
  pieceLayout: Matrix<keyof PR | 0>;

  // TODO: Should this be here? Should it be required?
  pieceAssets?: Record<keyof PR, string>;
};
