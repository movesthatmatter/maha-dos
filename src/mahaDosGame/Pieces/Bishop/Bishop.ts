import { Err, Ok, Result } from 'ts-results';
import { Game } from '../../../gameMechanics/Game/Game';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { range, Coord } from '../../../gameMechanics/util';
import { toDictIndexedBy } from '../../../gameMechanics/utils';
import { AttackNotPossibleError } from '../../../gameMechanics/Game/errors/types';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition
} from '../utils';
import {
  Attack,
  AttackOutcome,
  Color,
  Move
} from 'src/gameMechanics/commonTypes';

const pieceLabel = 'Bishop';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 10,
  moveRange: 5,
  attackRange: 6,
  attackDamage: 3,
  canAttack: true,
  pieceHasMoved: false
};

export class Bishop extends Piece {
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
      //Set them clockwise from top - right
      movesDirections: [
        { row: -1, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: -1 }
      ],
      maxHitPoints: 10,
      canDie: true
    });
  }

  evalMove(game: Game): Move[] {
    // the rules for the bishop algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.getPieceCoordById(this.state.id);

    if (!pieceCoord) {
      return [];
    }

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.getPieceCoordById(this.state.id);

    if (!pieceCoord) {
      return [];
    }

    const attacks: Attack[] = [];
    const length = game.state.history.length;

    if (
      length > 0 &&
      typeof game.state.history[length - 1][0][this.state.color] !== 'undefined'
    ) {
      const movesByPieceId = toDictIndexedBy(
        game.state.history[length - 1][0][this.state.color] as Move[],
        (move) => move.piece.id
      );

      if (this.state.id in movesByPieceId) {
        return attacks;
      }
    }

    this.state.movesDirections.map((dir) => {
      let hitObstacle = false;
      range(this.state.attackRange, 1).map((r) => {
        if (hitObstacle) {
          return;
        }
        const target: Coord = {
          row: pieceCoord.row + dir.row * r,
          col: pieceCoord.col + dir.col * r
        };

        if (
          target.row >= game.board.state.pieceLayoutState.length ||
          target.col >= game.board.state.pieceLayoutState[0].length ||
          target.row < 0 ||
          target.col < 0
        ) {
          return;
        }

        const targetPiece = game.board.getPieceByCoord(target);

        if (!targetPiece) {
          return;
        }

        if (r === 1) {
          if (targetPiece.state.label === 'Rook') {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: 'range'
            });
            hitObstacle = true;
            return;
          }
        } else {
          if (targetPiece.state.color !== this.state.color) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: 'range'
            });
          } else {
            if (r < 4) {
              attacks.push({
                from: pieceCoord,
                to: target,
                type: 'range'
              });
            }
          }
          hitObstacle = true;
          return;
        }
      });
    });

    return attacks;
  }

  calculateAttackOutcome(
    game: Game,
    attack: Attack
  ): Result<AttackOutcome, AttackNotPossibleError> {
    const targetPiece = game.board.getPieceByCoord(attack.to);

    if (!targetPiece) {
      return new Err({
        type: 'AttackNotPossible',
        content: {
          reason: 'AttackerPieceNotExistent'
        }
      });
    }

    const attackBonus = targetPiece.state.label === 'Knight' ? 1 : 0;
    const heal = targetPiece.state.color === this.state.color;

    let kingDefense = 0;
    if (targetPiece.state.label === 'King') {
      kingDefense =
        getAllAdjecentPiecesToPosition(
          attack.to,
          game.board.state.pieceLayoutState
        ).filter(
          (p) => p.label === 'Rook' && p.color === targetPiece.state.color
        ).length > 0
          ? 1
          : 0;
    }

    return Ok({
      attack,
      hasMoved: false,
      damage: heal
        ? Math.ceil(targetPiece.state.hitPoints / 2) > 5
          ? -5
          : -Math.ceil(targetPiece.state.hitPoints / 2)
        : this.state.attackDamage - kingDefense
    });
  }
}
