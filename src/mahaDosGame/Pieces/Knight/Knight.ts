import { Game } from '../../../gameMechanics/Game/Game';
import { Color } from '../../../gameMechanics/util/types';
import { Attack, Move } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { evalEachDirectionForMove } from '../utils';
import { PieceLayoutState } from '../../../gameMechanics/Board/types';
import { AttackTargetPieceUndefined } from '../../../gameMechanics/Game/errors';
import { Err, Ok, Result } from 'ts-results';

const pieceLabel = 'Knight';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 12,
  moveRange: 1,
  attackRange: 1,
  attackDamage: 2,
  canAttack: true,
  pieceHasMoved: false
};

export class Knight extends Piece {
  constructor(
    color: Color,
    id: IdentifiablePieceState<typeof pieceLabel>['id'],
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

    const pieceCoord = game.board.getPieceCoordById(this.state.id);

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.getPieceCoordById(this.state.id);

    return [];
  }

  executeAttack(
    game: Game,
    attack: Attack
  ): Result<PieceLayoutState, AttackTargetPieceUndefined> {
    const targetPiece = game.board.getPieceByCoord(attack.to);
    //TODO: Better typecheck. Deal with error handling
    if (targetPiece) {
      return new Err({
        type: 'TargetPieceIsUndefined',
        content: undefined
      });
    }
    return Ok({} as PieceLayoutState);
  }
}
