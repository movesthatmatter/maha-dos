import { Game } from '../../../gameMechanics/Game/Game';
import { Color } from '../../../gameMechanics/util/types';
import { Attack, Move } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { evalEachDirectionForMove } from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { PieceLayoutState } from '../../../gameMechanics/Board/types';
import { AttackTargetPieceUndefined } from '../../../gameMechanics/engine';

const pieceLabel = 'Pawn';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 6,
  attackRange: 1,
  attackDamage: 1,
  canAttack: true,
  moveRange: 1,
  pieceHasMoved: false
};

export class Pawn extends Piece {
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
      movesDirections:
        color === 'white' ? [{ row: -1, col: 0 }] : [{ row: 1, col: 0 }],
      attackDirection:
        color === 'white'
          ? [
              { row: -1, col: 1 },
              { row: -1, col: -1 }
            ]
          : [
              { row: 1, col: -1 },
              { row: 1, col: 1 }
            ],
      maxHitPoints: 6,
      canDie: true,
      moveRange: dynamicProps?.pieceHasMoved ? 1 : 2
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the pawn algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    //take into account the attack direction!!
    return [];
  }

  executeAttack(
    game: Game,
    attack: Attack
  ): Result<PieceLayoutState, AttackTargetPieceUndefined> {
    const targetPiece = game.board.pieceLayout[attack.to.row][attack.to.col];
    //TODO: Better typecheck. Deal with error handling
    if (targetPiece === 0) {
      return new Err({
        type: 'TargetPieceIsUndefined',
        content: undefined
      });
    }
    return Ok({} as PieceLayoutState);
  }
}
