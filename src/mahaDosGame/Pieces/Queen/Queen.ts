import { Game } from 'src/gameMechanics/Game/Game';
import { Color } from 'src/gameMechanics/util/types';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import { range, Coord } from 'src/gameMechanics/util';
import {
  evalEachDirectionForMove,
  getAllAdjecentPiecesToPosition
} from '../utils';
import { Err, Ok, Result } from 'ts-results';
import { PieceLayoutState } from 'src/gameMechanics/Board/types';
import { AttackTargetPieceUndefined } from 'src/gameMechanics/engine';
import { toDictIndexedBy } from 'src/gameMechanics/utils';
import { King } from '../King';

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

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    const attacks: Attack[] = [];
    const { history } = game.state;
    const adjecentPieces = getAllAdjecentPiecesToPosition(
      pieceCoord,
      game.board.pieceLayout
    );
    const crit =
      adjecentPieces.filter(
        (p) => p instanceof King && p.state.color === this.state.color
      ).length > 0;

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
            target.row < game.board.pieceLayout.length &&
            target.col < game.board.pieceLayout[0].length &&
            target.row >= 0 &&
            target.col >= 0
          ) {
            const tPiece = game.board.pieceLayout[target.row][target.col];
            if (tPiece !== 0 && tPiece.state.color !== this.state.color) {
              attacks.push({
                from: pieceCoord,
                to: target,
                type: 'melee',
                ...(crit && { crit: true })
              });
            }
          }
        }
      } else {
        attacks.push(
          ...this.processQueenAttacksWithoutPriorMovement(game, crit)
        );
      }
    } else {
      attacks.push(...this.processQueenAttacksWithoutPriorMovement(game, crit));
    }
    return attacks;
  }

  processQueenAttacksWithoutPriorMovement(
    game: Game,
    withCrit: boolean
  ): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    const attacks: Attack[] = [];
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
          target.row >= game.board.pieceLayout.length ||
          target.col >= game.board.pieceLayout[0].length ||
          target.row < 0 ||
          target.col < 0
        ) {
          return;
        }
        const targetPiece = game.board.pieceLayout[target.row][target.col];
        if (targetPiece !== 0) {
          if (targetPiece.state.color !== this.state.color) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: r === 1 ? 'melee' : 'range',
              ...(withCrit && { crit: true })
            });
          }
          hitObstacle = true;
          return;
        }
      });
    });
    return attacks;
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
