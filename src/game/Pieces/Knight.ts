import { Coord, GameState, IdentifiablePieceProps, PieceProps } from '../types';
import { Piece } from './Piece';

export class Knight extends Piece {
  constructor(id: IdentifiablePieceProps['id'], initialProps?: PieceProps) {
    super(id, {
      ...initialProps,
      type: 'Knight',
      health: 6,
      color: 'black',
      range: 5,
      hitPoints: 3,
      movesDirections: [],
      canAttack: false
    });
  }

  update(next: IdentifiablePieceProps) {
    this.props = next;
  }

  evalMove(gameState: GameState): Coord[] {
    // the rules for the knight algortighm

    // returns all the possible moves;

    // be able to grab the coords form the gameState

    const pieceCoord = gameState.board.pieceCoordsById[this.props.id];

    // TODO: Add the coords
    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
