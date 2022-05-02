import { Result } from 'ts-results';
import { PieceLayoutState } from '../Board/types';
import { AttackTargetPieceUndefined } from '../engine';
import { Game } from '../Game/Game';
import { Attack, Move } from '../Game/types';
import { IdentifiablePieceState, PieceState } from './types';

// TODO: Don'l default the L here - it must be given from outside
export abstract class Piece<L extends string = string> {
  public state: IdentifiablePieceState<L>;

  constructor(id: IdentifiablePieceState<L>['id'], props: PieceState<L>) {
    this.state = { ...props, id };
  }

  // Here is where the rules for the move algortighm live
  // Returns all the possible moves for this piece
  // TODO: Does this actually need to be the Board not the Game?
  abstract evalMove(game: Game): Move[];

  // Here is where the rules for the attack algorithm live
  // Returns all the possible attacks from this piece
  // TODO: Does this actually need to be the Board not the Game?
  abstract evalAttack(game: Game): Attack[];

  //Here the attack gets processed on the current state
  //Returns a new piece layout state that hold the updated stats and positions
  //TODO: Does this live here or in the enigne?
  abstract executeAttack(
    state: Game,
    attack: Attack
  ): Result<PieceLayoutState, AttackTargetPieceUndefined>;
}
