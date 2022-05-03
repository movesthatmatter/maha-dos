import { BoardState } from '../Board/types';
import {
  IdentifiablePieceState,
  PieceRegistry,
  PieceState
} from '../Piece/types';
import { TerrainProps } from '../Terrain/Terrain';
import { Matrix } from '../util';
import { Color, Coord } from '../util/types';

export type Move = ShortMove & {
  piece: IdentifiablePieceState<string>;
};

export type ShortMove = {
  from: Coord;
  to: Coord;
  promotion?: PieceState<string>['label'];
};

export type Attack = {
  from: Coord;
  to: Coord;
  type: 'range' | 'melee';
  //TODO - better organize the type based on other bonus attack/defense mechanism
  special?: 'heal' | 'crit';
  aoe?: Coord[];
};

// A Partial Game In Move Phase doesn't have the Attack Phase
export type PartialGameTurnMovePhase = [{ [k in Color]: Move[] | undefined }];

// A Partial Game in Attack Phase always has the Move Phase
export type PartialGameTurnAttackPhase = [
  { [k in Color]: Move[] },
  { [k in Color]: Attack[] | undefined }
];
export type PartialGameTurn =
  | PartialGameTurnMovePhase
  | PartialGameTurnAttackPhase;

export type FullGameTurn = [
  { [k in Color]: Move[] },
  { [k in Color]: Attack[] }
];

export type GameTurn = PartialGameTurn | FullGameTurn;

// TODO: The reconciliation for a whole history could become to costly
//  so in that case we will need to optimize it (caching, memoizine, save the pieceLayout at each step, etc..)
//  but for now we leave it as is, b/c this is the most raw data!
export type GameHistory = GameTurn[];

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
            moves: Move[];
          };
          black: {
            canDraw: true;
            moves: Move[];
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
            moves: Move[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: false; // When canDraw is false it means player Submitted
            moves: Move[];
          };
          black: {
            canDraw: true;
            moves: undefined;
          };
        }
    ))
  | ({
      phase: 'attack';
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
            attacks: Attack[];
          };
          black: {
            canDraw: true;
            attacks: Attack[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: true;
            attacks: Attack[];
          };
          black: {
            canDraw: false; // When Can Draw is false it means player Submitted
            attacks: Attack[];
          };
        }
      | {
          submissionStatus: 'partial';
          white: {
            canDraw: false; // When Can Draw is false it means player Submitted
            attacks: Attack[];
          };
          black: {
            canDraw: true;
            attacks: Attack[];
          };
        }
    ));

export type GameStateInProgress = {
  boardState: BoardState;
  // TODO: This needs to change to stateStatus
  state: 'inProgress';
  history: GameHistory;
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

export const isGameInMovePhase = (g: GameState): g is GameStateInMovePhase =>
  g.state === 'inProgress' && g.phase === 'move';

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
};

