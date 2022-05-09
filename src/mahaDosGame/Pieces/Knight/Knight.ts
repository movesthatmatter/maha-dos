import { Game } from '../../../gameMechanics/Game/Game';
import { GameStateInProgress } from '../../../gameMechanics/Game/types';
import {
  Move,
  Attack,
  Color,
  AttackOutcome
} from 'src/gameMechanics/commonTypes';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import { Coord } from '../../../gameMechanics/util';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition,
  getPieceMoveThisTurn
} from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { AttackNotPossibleError } from '../../../gameMechanics/Game/errors/types';

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

    if (!pieceCoord) {
      return [];
    }
    if (!(game.state as GameStateInProgress)[this.state.color].canDraw) {
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
    const moved = getPieceMoveThisTurn(this, game);

    this.state.movesDirections.map((dir) => {
      const target: Coord = {
        row: pieceCoord.row + dir.row,
        col: pieceCoord.col + dir.col
      };
      if (target.row === moved?.from.row && target.col === moved.from.col) {
        return;
      }
      if (
        target.row >= game.board.state.pieceLayoutState.length ||
        target.col >= game.board.state.pieceLayoutState[0].length ||
        target.row < 0 ||
        target.col < 0
      ) {
        return;
      }
      const targetPiece = game.board.getPieceByCoord(target);

      if (targetPiece && targetPiece.state.color !== this.state.color) {
        attacks.push({
          from: pieceCoord,
          to: target,
          type: 'melee'
        });
      }
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

    const moved = getPieceMoveThisTurn(this, game);
    const attackBonus =
      getAllAdjecentPiecesToPosition(
        attack.from,
        game.board.state.pieceLayoutState
      ).filter((p) => p.label === 'Queen' && p.color === this.state.color)
        .length > 0;

    const moveDamage = moved ? 1 : 0;
    const bonusDamage = attackBonus ? 1 : 0;

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
      hasMoved: true,
      damage:
        this.state.attackDamage +
        moveDamage +
        bonusDamage -
        defenseBonus -
        kingDefense
    });
  }
}
