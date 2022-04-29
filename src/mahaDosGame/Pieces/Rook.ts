import { Color } from 'src/gameMechanics/types';
import { Game } from '../../gameMechanics/Game/Game';
import { Attack, Move } from '../../gameMechanics/Game/types';
import { Piece } from '../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../gameMechanics/Piece/types';

type PieceLabel = 'Rook';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 15,
  moveRange: 4,
  attackRange: 6,
  attackDamage: 3,
  canAttack: true
};

export class Rook extends Piece<PieceLabel> {
  constructor(
    id: IdentifiablePieceState<PieceLabel>['id'],
    color: Color,
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: 'Rook',
      movesDirections: [], // TODO: Fix this
      maxHitPoints: 15
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
