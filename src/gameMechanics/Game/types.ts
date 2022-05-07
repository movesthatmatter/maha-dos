import { BoardState } from '../Board/types';
import {
  IdentifiablePieceState,
  PieceRegistry,
  PieceState
} from '../Piece/types';
import { TerrainProps } from '../Terrain/Terrain';
import { Matrix } from '../util';
import { Color, Coord } from '../util/types';

// TODO: Think of a better naming between Short & Move|Attack
//  b/c what really needs to happen here is the disinction between input (Plan or Draw Move|Attack)
//  and the output (The Move or Attack's outcome);

// TODO: Rename this Move
export type ShortMove = {
  from: Coord;
  to: Coord;
  promotion?: PieceState<string>['label'];
};

// TODO: Rename this MoveOutcome so it uses the same standard as Attack
export type Move = ShortMove & {
  piece: IdentifiablePieceState<string>;
};

export type ShortAttack = {
  from: Coord;
  to: Coord;
  type: 'range' | 'melee';
};

// TODO: This is actuall just the ShortAttack as the SpecialAttacks aren't needed here!
// TODO: Take the SpecialAttacks out as they aren't needed in the Attack
export type Attack = ShortAttack & SpecialAttacks;

export type SpecialAttacks = {
  // heal?: boolean;
  // crit?: boolean;
  // attackBonus?: boolean;
  // defenseBonus?: boolean;
  // defensePenalty?: boolean;
  // movementAttackBonus?: boolean;
  aoe?: Coord[];
};

export type AttackOutcome = {
  attack: ShortAttack;
  hasMoved: boolean;
  damage: number;

  // TODO: Add the special/bonus here once we need it
  // special
  special?: SpecialAttacks;
};

// export type AttackOutcome = Attack & {
//   attacker: PieceState<string>['label'];
//   victim: PieceState<string>['label'];

//   heal?: boolean;
//   crit?: boolean;
//   attackBonus?: boolean;
//   defenseBonus?: boolean;
//   defensePenalty?: boolean;
//   movementAttackBonus?: boolean;
//   aoe?: Coord[];
// }

// // A Partial Game In Move Phase doesn't have the Attack Phase
// export type PartialGameTurn = [{ white: Move[]; black: Move[] }];

// A Partial Game In Move Phase doesn't have the Attack Phase
export type PartialGameTurnMovePhase = [{ [k in Color]: Move[] | undefined }];

// A Partial Game in Attack Phase always has the Move Phase
export type PartialGameTurnAttackPhase = [
  { [k in Color]: Move[] },
  { [k in Color]: AttackOutcome[] | undefined }
];
export type PartialGameTurn =
  | PartialGameTurnMovePhase
  | PartialGameTurnAttackPhase;

export type FullGameTurn = [
  { [k in Color]: Move[] },
  { [k in Color]: AttackOutcome[] }
];
export type GameTurn = PartialGameTurn | FullGameTurn;

// TODO: The reconciliation for a whole history could become to costly
//  so in that case we will need to optimize it (caching, memoizine, save the pieceLayout at each step, etc..)
//  but for now we leave it as is, b/c this is the most raw data!
// export type GameHistory = FullGameTurn[] | [...FullGameTurn[], PartialGameTurn];
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
