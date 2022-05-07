import { Game } from '../../../gameMechanics/Game/Game';
import { Color, Coord } from '../../../gameMechanics/util/types';
import { Attack, Move, AttackOutcome } from '../../../gameMechanics/Game/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition,
  getPieceMoveThisTurn
} from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { AttackNotPossibleError } from '../../../gameMechanics/Game/errors/types';

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
    if (!this.state.attackDirection) {
      return [];
    }

    return this.state.attackDirection.reduce((attacks, dir) => {
      const target: Coord = {
        row: pieceCoord.row + dir.row,
        col: pieceCoord.col + dir.col
      };
      if (
        target.row >= game.board.state.pieceLayoutState.length ||
        target.col >= game.board.state.pieceLayoutState[0].length ||
        target.row < 0 ||
        target.col < 0
      ) {
        return attacks;
      }
      const targetPiece = game.board.getPieceByCoord(target);
      if (targetPiece && targetPiece.state.color !== this.state.color) {
        const attack: Attack = {
          from: pieceCoord,
          to: target,
          type: 'melee'
        };
        return [...attacks, attack];
      }
      return attacks;
    }, [] as Attack[]);
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
      damage: (moved ? 2 : 1) - defenseBonus - kingDefense
    });
  }
}
