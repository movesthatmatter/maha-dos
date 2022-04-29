import { Game } from '../../gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from '../../gameMechanics/Game/types';
import { Piece } from '../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../gameMechanics/Piece/types';

const pieceLabel = 'Pawn';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 6,
  moveRange: 1, // can be 2 for en-pasant!
  attackRange: 1, // can be 2 for range
  attackDamage: 1,
  canAttack: true
};

export class Pawn extends Piece {
  constructor(
    id: IdentifiablePieceState<typeof pieceLabel>['id'],
    color: Color,
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: pieceLabel,
      movesDirections: [], // TODO: Fix this
      maxHitPoints: 6,
      canDie: true
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
