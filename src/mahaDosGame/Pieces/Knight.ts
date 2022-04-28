import { Game } from '../../gameMechanics/Game/Game';
import { Attack, Move } from '../../gameMechanics/Game/types';
import { Piece } from '../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceState
} from '../../gameMechanics/Piece/types';

export class Knight extends Piece {
  constructor(
    id: IdentifiablePieceState<'Knight'>['id'],
    initialProps?: PieceState<'Knight'>
  ) {
    super(id, {
      ...initialProps,
      label: 'Knight',
      health: 6,
      color: 'black',
      range: 5,
      hitPoints: 3,
      movesDirections: [],
      canAttack: false
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the knight algortighm

    // returns all the possible moves;

    // be able to grab the coords form the gameState

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    // TODO: Add the coords
    return [];
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
