import { GameConfigurator } from '../Game/types';
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
}

export class Board<PR extends PieceRegistry> implements IBoard {
  state: BoardState;

  pieceLayout: PieceLayout;

  pieceCoordsByPieceId: {
    [pieceId: string]: Coord;
  };

  private terrain: Terrain;

  constructor(pieceRegistry: PR, props: Pick<GameConfigurator<PR>, 'pieceLayout' | 'terrain'>) {
    // TODO: This should be created here from the given props!
    this.terrain = new Terrain(props.terrain)

    this.pieceLayout = matrixMap(props.pieceLayout, (label, [row, col]) => {
      if (label === 0) {
        return 0;
      }

      const color = getInitialPieceColorAtCoord(props.pieceLayout, {x: row, y: col});

      return pieceRegistry[label](`${color}-${label}-${row}-${col}`, color);
    });

    this.state = this.getDerivedState();

    this.pieceCoordsByPieceId = {};
  }

  private getDerivedState(): BoardState {
    return {
      terrainState: this.terrain.state,
      pieceLayoutState: matrixMap(this.pieceLayout, (x) => x === 0 ? x : x.state)
    }
  }

  // TODO: Ensure the state gets refreshed anytime there are updates!
}
