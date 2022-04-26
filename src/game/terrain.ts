import { range } from './util';

export type TerrainSquareType =
  | 'x' // hole
  | 'w' // white square
  | 'b'; // black square;

export type Terrain = TerrainSquareType[][];

export const createTerrain = (props: {
  width: number;
  height?: number; // if different than width
}): Terrain => {
  // TBD
  const height = props.height || props.width;

  return range(props.width).map((row) => {
    return range(height).map((col) => ((row + col) % 2 ? 'b' : 'w'));
  });
};
