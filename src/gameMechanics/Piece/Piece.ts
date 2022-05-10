import { Result } from 'ts-results';
import { Attack, AttackOutcome, Move } from '../commonTypes';
import { AttackNotPossibleError } from '../Game/errors';
import { IGame } from '../Game/IGame';
import { IdentifiablePieceState, PieceState } from './types';

// TODO: Don'l default the L here - it must be given from outside
export abstract class Piece<L extends string = string> {
  public state: IdentifiablePieceState<L>;

  constructor(id: IdentifiablePieceState<L>['id'], props: PieceState<L>) {
    this.state = { ...props, id };
  }

  calculateNextState<P extends Partial<IdentifiablePieceState<L>>>(
    getNextState:
      | P
      | ((
          prev: IdentifiablePieceState<L>
        ) => Partial<IdentifiablePieceState<L>>)
  ): IdentifiablePieceState<L> {
    const nextState =
      typeof getNextState === 'function'
        ? getNextState(this.state)
        : getNextState;

    return {
      ...this.state,
      ...nextState
    };
  }

  // abstract setStateDerivates(
  //   prevState: IdentifiablePieceState<L>,
  //   nextState: IdentifiablePieceState<L>
  // ): void;

  // Here is where the rules for the move algortighm live
  // Returns all the possible moves for this piece
  // TODO: Does this actually need to be the Board not the Game?
  abstract evalMove(game: IGame): Move[];

  // Here is where the rules for the attack algorithm live
  // Returns all the possible attacks from this piece
  // TODO: Does this actually need to be the Board not the Game?
  abstract evalAttack(game: IGame): Attack[];

  // Here the attack gets processed on the current state
  abstract calculateAttackOutcome(
    game: IGame,
    attack: Attack
  ): Result<AttackOutcome, AttackNotPossibleError>;
}
