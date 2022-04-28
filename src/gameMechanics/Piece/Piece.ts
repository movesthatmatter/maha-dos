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
  // TODO: This actuall should probably depend on the Game not the GameState
  //  so it has access to all the derivatives and other methods
  abstract evalMove(game: Game): Move[];

  // Here is where the rules for the attack algorithm live
  // Returns all the possible attacks from this piece
  // TODO: This actuall should probably depend on the Game not the GameState
  //  so it has access to all the derivatives and other methods
  abstract evalAttack(game: Game): Attack[];
}
