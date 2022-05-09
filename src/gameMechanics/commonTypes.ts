// TODO: Think of a better naming between Short & Move|Attack
//  b/c what really needs to happen here is the disinction between input (Plan or Draw Move|Attack)
//  and the output (The Move or Attack's outcome);
import { IdentifiablePieceState, PieceState } from './Piece/types';
import { Coord } from './util';

export type WhiteColor = 'white';
export type BlackColor = 'black';
export type Color = WhiteColor | BlackColor;

export type ShortWhiteColor = 'w';
export type ShortBlackColor = 'b';
export type ShortColor = ShortWhiteColor | ShortBlackColor;

export type MoveDirection = Coord;

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
  // This means that the attacker took the victim's position!
  willTake: boolean;
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
export type PartialGameTurnMovePhase = [{ [k in Color]: Move[] }];

// A Partial Game in Attack Phase always has the Move Phase
// TODO: Modify this a the Attacks shouldn't be part of the Partial GameTurn, only the moves!
// export type PartialGameTurnAttackPhase = [
//   { [k in Color]: Move[] },
//   // { [k in Color]: AttackOutcome[] }
// ];
export type PartialGameTurn =
  | PartialGameTurnMovePhase
  // | PartialGameTurnAttackPhase;

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
