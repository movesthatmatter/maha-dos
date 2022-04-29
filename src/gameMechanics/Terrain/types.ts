import { Matrix } from "../types";

export type TerrainSquareType =
  | 'x' // hole
  | 'w' // white square
  | 'b'; // black square;

export type TerrainState = Matrix<TerrainSquareType>;
