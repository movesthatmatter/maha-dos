import { Matrix } from '../util';
import { ShortBlackColor, ShortWhiteColor } from '../util/types';

export type TerrainSquareType =
  | 'x' // hole
  | ShortWhiteColor // white square
  | ShortBlackColor; // black square;

export type TerrainState = Matrix<TerrainSquareType>;
