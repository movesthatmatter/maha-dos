import { Game } from '../../../gameMechanics/Game/Game';
import { Color } from '../../../gameMechanics/util/types';
import { Attack, Move, AttackOutcome } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { range, Coord } from '../../../gameMechanics/util';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition
} from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { toDictIndexedBy } from '../../../gameMechanics/utils';
import { AttackNotPossibleError } from '../../../gameMechanics/Game/errors/types';

const pieceLabel = 'Queen';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 20,
  moveRange: 7,
  attackRange: 7,
  attackDamage: 4,
  canAttack: true,
  pieceHasMoved: false
};

export class Queen extends Piece {
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
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: -1 },
        { row: 0, col: -1 },
        { row: -1, col: -1 }
      ],
      maxHitPoints: 20,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the Queen algortighm

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
    const { history } = game.state;

    if (
      history &&
      history.length > 0 &&
      typeof history[history.length - 1][0][this.state.color] !== 'undefined'
    ) {
      const movesByPieceId = toDictIndexedBy(
        history[history.length - 1][0][this.state.color] as Move[],
        (move) => move.piece.id
      );
      if (this.state.id in movesByPieceId) {
        const queenMove: Move = movesByPieceId[this.state.id];
        const delta: Coord = {
          row:
            queenMove.from.row === queenMove.to.row
              ? 0
              : queenMove.from.row < queenMove.to.row
              ? 1
              : -1,
          col:
            queenMove.from.col === queenMove.to.col
              ? 0
              : queenMove.from.col < queenMove.to.col
              ? 1
              : -1
        };
        const squaresRow = Math.abs(queenMove.to.row - queenMove.from.row);
        const squaresCol = Math.abs(queenMove.to.row - queenMove.from.col);
        const squares = Math.max(squaresRow, squaresCol);

        if (squares < this.state.attackRange) {
          const target: Coord = {
            row: pieceCoord.row + delta.row,
            col: pieceCoord.col + delta.col
          };
          if (
            target.row < game.board.state.pieceLayoutState.length &&
            target.col < game.board.state.pieceLayoutState[0].length &&
            target.row >= 0 &&
            target.col >= 0
          ) {
            const tPiece = game.board.getPieceByCoord(target);

            if (tPiece && tPiece.state.color !== this.state.color) {
              attacks.push({
                from: pieceCoord,
                to: target,
                type: 'melee'
              });
            }
          }
        }
      } else {
        attacks.push(...this.processQueenAttacksWithoutPriorMovement(game));
      }
    } else {
      attacks.push(...this.processQueenAttacksWithoutPriorMovement(game));
    }

    return attacks;
  }

  processQueenAttacksWithoutPriorMovement(game: Game): Attack[] {
    const pieceCoord = game.board.getPieceCoordById(this.state.id);
    const attacks: Attack[] = [];

    if (!pieceCoord) {
      return [];
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

        if (targetPiece) {
          if (targetPiece.state.color !== this.state.color) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: r === 1 ? 'melee' : 'range'
            });
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

    //TODO: Better typecheck. Deal with error handling
    if (!targetPiece) {
      return new Err({
        type: 'AttackNotPossible',
        content: {
          reason: 'AttackerPieceNotExistent'
        }
      });
    }

    const crit =
      getAllAdjecentPiecesToPosition(
        attack.from,
        game.board.state.pieceLayoutState
      ).filter((p) => p.label === 'King' && p.color === this.state.color)
        .length > 0;

    const critDmg = crit ? 1 : 0;

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

    const defenseBonus =
      targetPiece.state.label === 'Bishop' ||
      targetPiece.state.label === 'Knight'
        ? 1
        : 0;

    return Ok({
      attack,
      hasMoved: attack.type === 'melee',
      damage: this.state.attackDamage + critDmg - defenseBonus - kingDefense
    });
  }
}
