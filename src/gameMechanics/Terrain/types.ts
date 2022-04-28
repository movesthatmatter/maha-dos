export type TerrainSquareType =
  | 'x' // hole
  | 'w' // white square
  | 'b'; // black square;

export type TerrainState = TerrainSquareType[][];
