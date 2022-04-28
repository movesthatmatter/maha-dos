import { Result } from 'ts-results';
import { Coord } from '../types';
import { Attack, GameState, Move } from './types';
import { AttackNotPossibleError, MoveNotPossibleError } from './errorTypes';
import { Board } from '../Board/Board';

export interface Game {
  state: GameState;

  board: Board;

  constructor(props?: Partial<GameState>): void;

  // Loads a new GameState and does all the needed calculations
  load(state: GameState): void;

  // When a Move is Succesfully Drawn it gets appended to the nextMoves List of the "move" phase
  drawMove(from: Coord, to: Coord): Result<Move, MoveNotPossibleError>;

  // When an Attack is Succesfully Drawn it gets appended to the nextAttacks List of the "attack" phase
  drawAttack(from: Coord, to: Coord): Result<Attack, AttackNotPossibleError>;
}
