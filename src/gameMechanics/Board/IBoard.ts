import { Result } from "ts-results";
import { AttackOutcome, Move, ShortAttack, ShortMove } from "../commonTypes";
import { AttackNotPossibleError } from "../Game/errors";
import { IGame } from "../Game/IGame";
import { Piece } from "../Piece/Piece";
import { PieceRegistry } from "../Piece/types";
import { Coord } from "../util";
import { BoardState } from "./types";

export interface IBoard<PR extends PieceRegistry> {
  getPieceByCoord(coord: Coord): Piece | undefined;

  getPieceById(pieceId: string): Piece | undefined;

  getPieceCoordById(pieceId: string): Coord | undefined;

  // This is done so there are no external updates
  get state(): BoardState;

  setState(nextState: Partial<BoardState>): void;

  // Deprecate it in favor of applyMoves, which signifies better that it happens once per turn
  // @deprecate
  move(m: ShortMove): Result<Move, 'MoveNotPossible'>;

  // Rename this to applyMoves as it shouldn't happen multipel times
  moveMultiple(moves: ShortMove[]): Result<Move[], 'MovesNotPossible'>;

  // TODO: Test
  applyAttacks(
    game: IGame,
    attacks: ShortAttack[]
  ): Result<AttackOutcome[], AttackNotPossibleError>;
}