import { GameConfigurator } from '../Game/types';
import { Piece } from '../Piece/Piece';
import { PieceRegistry } from '../Piece/types';
import { Terrain } from '../Terrain/Terrain';
import { matrixMap } from '../util';
import { Coord } from '../util/types';
import { BoardState, PieceLayout } from './types';
import { getInitialPieceColorAtCoord } from './util';

export interface IBoard {
  state: BoardState;

  pieceCoordsByPieceId: {
    [pieceId: string]: Coord;
  };

  getPieceById(id: string): Piece | undefined;

  getPieceByCoord(coord: Coord): Piece | undefined;
}

export class Board<PR extends PieceRegistry> implements IBoard {
  state: BoardState;

  pieceLayout: PieceLayout;

  pieceCoordsByPieceId: {
    [pieceId: string]: Coord;
  };

  private terrain: Terrain;

  constructor(
    pieceRegistry: PR,
    props: Pick<GameConfigurator<PR>, 'pieceLayout' | 'terrain'>
  ) {
    // TODO: This should be created here from the given props!
    this.terrain = new Terrain(props.terrain);

    this.pieceCoordsByPieceId = {};

    this.pieceLayout = matrixMap(props.pieceLayout, (label, [row, col]) => {
      if (label === 0) {
        return 0;
      }

      const coord = { row, col };
      const color = getInitialPieceColorAtCoord(props.pieceLayout, coord);

      const id = `${color}-${label}-${row}-${col}`;

      // TODO: This shouldn't be here!
      this.pieceCoordsByPieceId[id] = coord;

      return pieceRegistry[label](id, color);
    });

    this.state = this.getDerivedState();

    // this.pieceCoordsByPieceId = matrixMap(this.pieceLayout, () => {});
  }

  private getDerivedState(): BoardState {
    return {
      terrainState: this.terrain.state,
      pieceLayoutState: matrixMap(this.pieceLayout, (x) =>
        x === 0 ? x : x.state
      )
    };
  }

  getPieceByCoord(coord: Coord) {
    const squareOrPiece = this.pieceLayout[coord.row][coord.col];

    if (squareOrPiece === 0) {
      return undefined;
    }

    // Piece
    return squareOrPiece;
  }

  getPieceById(pieceId: string) {
    const coord = this.pieceCoordsByPieceId[pieceId];

    return coord ? this.getPieceByCoord(coord) : undefined;
  }

  // TODO: Ensure the state gets refreshed anytime there are updates!
}
