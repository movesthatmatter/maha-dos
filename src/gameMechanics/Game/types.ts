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

export type GameStateCompleted = {
  state: 'completed';
  winner: Color | '1/2';
  boardState: BoardState;
};

export type GameStateInProgress = {
  state: 'inProgtress';
  winner?: undefined;
  boardState: BoardState;
} & (
  | ({
      phase: 'move';
    } & (
      | {
          submissionStatus: 'none';
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
    ))
);

export type GameState = GameStateInProgress | GameStateCompleted;

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
