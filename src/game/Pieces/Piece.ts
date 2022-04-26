import { Coord, GameState, IdentifiablePieceProps, PieceProps } from '../types';

export abstract class Piece {
  public props: IdentifiablePieceProps;

  constructor(id: string, props: PieceProps) {
    this.props = { ...props, id };
  }

  // return all the possible destinations for this piece
  // the rules for the algortighm
  abstract evalMove(gameState: GameState): Coord[];

  serialize() {
    return this.props;
  }
}
