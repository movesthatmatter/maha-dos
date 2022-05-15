import { Game } from '../../../gameMechanics/Game/Game';
import { Coord } from '../../../gameMechanics/util/types';
import { Piece } from '../../../gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from '../../../gameMechanics/Piece/types';
import {
  calculateDistanceBetween2Coords,
  checkForRookOnDeterminedDirection,
  evalEachDirectionForMove
} from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { AttackNotPossibleError } from '../../../gameMechanics/Game/errors/types';
import {
  Attack,
  AttackOutcome,
  Color,
  Move
} from '../../../gameMechanics/commonTypes';
import { coordsAreEqual, range } from 'src/gameMechanics/util';

const pieceLabel = 'King';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 3,
  moveRange: 1,
  attackRange: 1,
  attackDamage: 5,
  canAttack: true,
  pieceHasMoved: false
};

export class King extends Piece {
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
      maxHitPoints: 3,
      canDie: false
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the king algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.getPieceCoordById(this.state.id);

    if (!pieceCoord) {
      return [];
    }

    return [
      ...evalEachDirectionForMove(pieceCoord, this, game),
      ...(!this.state.pieceHasMoved
        ? [...this.checkCastlingOption(game, pieceCoord)]
        : [])
    ];
  }

  private checkCastlingOption(game: Game, pieceCoord: Coord): Move[] {
    return [
      { row: 0, col: 1 },
      { row: 0, col: -1 }
    ].reduce((moves, dir) => {
      const rookCoords = checkForRookOnDeterminedDirection(
        game.board.state.pieceLayoutState,
        pieceCoord,
        dir,
        this.state.color
      );
      if (rookCoords && game.board.getPieceByCoord(rookCoords)) {
        const distance = calculateDistanceBetween2Coords(
          pieceCoord,
          rookCoords
        );
        const kingMove: Move = {
          from: pieceCoord,
          to: {
            row: pieceCoord.row,
            col: pieceCoord.col + Math.ceil(distance / 2) * dir.col
          },
          piece: this.state,
          castle: {
            from: rookCoords,
            to: {
              row: rookCoords.row,
              col:
                rookCoords.col -
                (distance % 2 === 0
                  ? Math.floor(distance / 2 + 1) * dir.col
                  : Math.ceil(distance / 2) * dir.col)
            }
          }
        };
        return [...moves, kingMove];
      }
      return moves;
    }, [] as Move[]);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.getPieceCoordById(this.state.id);
    if (!pieceCoord) {
      return [];
    }

    return this.state.movesDirections.reduce((attacks, dir) => {
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

    if (!targetPiece) {
      return new Err({
        type: 'AttackNotPossible',
        content: {
          reason: 'AttackerPieceNotExistent'
        }
      });
    }
    const defenseBonus =
      targetPiece.state.label === 'Bishop' ||
      targetPiece.state.label === 'NKnight'
        ? 1
        : 0;

    const damage = this.state.attackDamage - defenseBonus;

    return Ok({
      attack,
      willTake: targetPiece.state.hitPoints - damage > 0 ? false : true,
      damage
    });
  }
}
