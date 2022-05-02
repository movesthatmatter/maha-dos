import { GameConfigurator } from '../Game/types';
import { PieceRegistry } from '../Piece/types';
import { Terrain } from '../Terrain/Terrain';
import { matrixMap } from '../util';
import { Coord } from '../util/types';
import { BoardState, PieceLayout } from './types';

export interface IBoard {
  state: BoardState;

  pieceCoordsByPieceId: {
    [pieceId: string]: Coord;
  };
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
      const color = label.toString().charAt(0) === 'w' ? 'white' : 'black';

      const id = `${color}-${label}-${row}-${col}`;

      // TODO: This shouldn't be here!
      this.pieceCoordsByPieceId[id] = coord;

      return pieceRegistry[label](id);
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

  // TODO: Ensure the state gets refreshed anytime there are updates!
}
