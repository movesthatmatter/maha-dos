import { Terrain } from '../terrain';
import { PiecesLayout, PieceProps, Coord, BoardState } from '../types';

export class Board {
  private rooksMoved = {
    white: { 1: false, 2: false },
    black: { 1: false, 2: false }
  };

  private kingsMoved = {
    white: false,
    black: false
  };

  private state: BoardState = {} as BoardState;

  constructor(boardState: BoardState) {
    this.buildTerrain(boardState.terrain, boardState.pieceLayout);
  }

  buildTerrain(terrain: Terrain, layout: PiecesLayout): Terrain {
    //logic here
    return [] as Terrain;
  }

  selectPieceToMove(piece: PieceProps, from: Coord) {}

  selectPieceToAttack(
    piece: PieceProps,
    target: PieceProps,
    square: Coord,
    targetSquare: Coord
  ) {}

  checkIfCastlingIsPossible(dest: Coord) {}

  checkForPromotion(to: Coord, piece: PieceProps) {}

  clearBoard() {}

  updateBoard(state: BoardState) {
    //logic here
    this.state = state;
  }
}
