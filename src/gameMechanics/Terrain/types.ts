import { ShortBlackColor, ShortWhiteColor } from '../commonTypes';
import { Matrix } from '../util';

export type TerrainSquareType =
  | 'x' // hole
  | ShortWhiteColor // white square
  | ShortBlackColor; // black square;

export type TerrainState = Matrix<TerrainSquareType>;
