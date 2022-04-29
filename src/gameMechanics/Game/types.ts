import { BoardState } from '../Board/types';
import { PieceState } from '../Piece/types';
import { Color, Coord } from '../types';

export type Move = {
  from: Coord;
  to: Coord;
  piece: PieceState<string>;
  promotion?: PieceState<string>['label'];
};

export type Attack = {
  from: Coord;
  to: Coord;
  type: 'range' | 'melee';
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
  state: 'pending';
  history: [];
  winner: undefined;
};

export type GameWinner = Color | '1/2';

export type GameStateCompleted = {
  boardState: BoardState;
  state: 'completed';
  history: GameHistory;
  winner: GameWinner;
};

export type GameStateInProgress = {
  boardState: BoardState;
  state: 'inProgress';
  history: GameHistory;
  winner: undefined;
} & (
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
          submissionStatus: 'partial';
          white: {
            canDraw: true;
            moves: Move[];
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
            moves: Move[];
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
    ))
);

export type GameState =
  | GameStatePending
  | GameStateInProgress
  | GameStateCompleted;

export type GameStateInMovePhase = Extract<GameState, { phase: 'move' }>;
export type GameStateInMovePhaseWithNoSubmission = Extract<
  GameStateInMovePhase,
  { submissionStatus: 'none' }
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
export type GameStateInAttackPhaseWithPartialSubmission = Extract<
  GameStateInAttackPhase,
  { submissionStatus: 'partial' }
>;
