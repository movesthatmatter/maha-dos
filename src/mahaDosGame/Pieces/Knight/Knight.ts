import { Game } from 'src/gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import { range, Coord } from 'src/gameMechanics/util';
import { evalEachDirectionForMove } from '../utils';

const pieceLabel = 'Knight';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 12,
  moveRange: 1,
  attackRange: 1,
  attackDamage: 2,
  canAttack: true
};

export class Knight extends Piece {
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
      movesDirections: [
        { row: -2, col: 1 },
        { row: -1, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: -1 },
        { row: 1, col: -2 },
        { row: -1, col: -2 },
        { row: -2, col: -1 }
      ],
      maxHitPoints: 12,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the knight algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return [];
  }

  // evalAttack(gameState: GameState) {
  //   //returns new pieces data
  // }
}
