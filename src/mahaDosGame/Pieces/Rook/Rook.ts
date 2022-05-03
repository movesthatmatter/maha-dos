import { Color } from 'src/gameMechanics/util/types';
import { Game } from 'src/gameMechanics/Game/Game';
import { Attack, Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import {
  IdentifiablePieceState,
  PieceDynamicProps
} from 'src/gameMechanics/Piece/types';
import { range, Coord } from 'src/gameMechanics/util';
import { evalEachDirectionForMove } from '../utils';
import { PieceLayoutState } from 'src/gameMechanics/Board/types';
import { AttackTargetPieceUndefined } from 'src/gameMechanics/engine';
import { Err, Ok, Result } from 'ts-results';
import { toDictIndexedBy } from 'src/gameMechanics/utils';

type PieceLabel = 'Rook';

const DEFAULT_DYNAMIC_PROPS: PieceDynamicProps = {
  hitPoints: 15,
  moveRange: 4,
  attackRange: 6,
  attackDamage: 3,
  canAttack: true,
  pieceHasMoved: false
};

export class Rook extends Piece<PieceLabel> {
  constructor(
    color: Color,
    id: IdentifiablePieceState<PieceLabel>['id'],
    dynamicProps?: Partial<PieceDynamicProps>
  ) {
    super(id, {
      ...DEFAULT_DYNAMIC_PROPS,
      ...dynamicProps,
      color,
      label: 'Rook',
      movesDirections: [
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 0, col: -1 }
      ],
      maxHitPoints: 15,
      canDie: true
    });
  }

  // update(next: IdentifiablePieceState) {
  //   this.props = next;
  // }

  evalMove(game: Game): Move[] {
    // the rules for the Rook algortighm

    // returns all the possible moves;

    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];

    return evalEachDirectionForMove(pieceCoord, this, game);
  }

  evalAttack(game: Game): Attack[] {
    const pieceCoord = game.board.pieceCoordsByPieceId[this.state.id];
    const attacks: Attack[] = [];
    const length = game.state.history.length;
    // check if past first turn of the game. Since we are in Attack phase, there should be the move phase already implemented hence why length = 2
    if (length < 2) {
      return attacks;
    }
    this.state.movesDirections.map((dir) => {
      range(this.state.attackRange, 1).map((r) => {
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
        //special attack, can move before this
        if (r === 1) {
          if (
            targetPiece !== 0 &&
            targetPiece.state.color !== this.state.color
          ) {
            attacks.push({
              from: pieceCoord,
              to: target,
              type: 'range'
            });
          }
        } else {
          //if it moved if cannot attack normal range
          if (
            typeof game.state.history[length - 1][0][this.state.color] !==
            'undefined'
          ) {
            const movesByPieceId = toDictIndexedBy(
              game.state.history[length - 1][0][this.state.color] as Move[],
              (move) => move.piece.id
            );

            if (this.state.id in movesByPieceId) {
              return attacks;
            }
          }
          if (
            targetPiece !== 0 &&
            targetPiece.state.color !== this.state.color
          ) {
            const attack: Attack = {
              from: pieceCoord,
              to: target,
              type: 'range'
            };
            //Special attack - AOE damage
            const aoe: Coord[] = [];
            this.state.movesDirections.map((d) => {
              const targetSq: Coord = {
                row: target.row + d.row,
                col: target.col + d.col
              };
              if (
                targetSq.row < game.board.pieceLayout.length &&
                targetSq.col < game.board.pieceLayout[0].length &&
                targetSq.row >= 0 &&
                targetSq.col >= 0
              ) {
                const tPiece =
                  game.board.pieceLayout[targetSq.row][targetSq.col];
                if (tPiece !== 0 && tPiece.state.color !== this.state.color) {
                  aoe.push({ row: targetSq.row, col: targetSq.col });
                }
              }
            });
            attacks.push({
              ...attack,
              ...(aoe.length > 0 && {
                aoe
              })
            });
          }
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
