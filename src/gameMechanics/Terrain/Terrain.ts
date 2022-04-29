import { TerrainState } from './types';
import { range } from '../util';

export type TerrainProps = {
  width: number;
  height?: number; // if different from width
};

export class Terrain {
  state: TerrainState;

  constructor(props: TerrainProps) {
    const height = props.height || props.width;

    this.state = range(props.width).map((row) =>
      range(height).map((col) => ((row + col) % 2 ? 'b' : 'w'))
    );
  }
}
