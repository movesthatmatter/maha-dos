// import { Terrain, TerrainState } from './terrain';

import { Piece } from '../Piece/Piece';
import { IdentifiablePieceState, PieceDynamicProps } from '../Piece/types';
import { TerrainProps } from '../Terrain/Terrain';
import { Matrix } from './matrix';

// This is used to generate the board and piece layout
// export type Matrix<T> = T[][];

// import { PieceState } from './Piece';

export type WhiteColor = 'white';
export type BlackColor = 'black';
export type Color = WhiteColor | BlackColor;

export type ShortWhiteColor = 'w';
export type ShortBlackColor = 'b';
export type ShortColor = ShortWhiteColor | ShortBlackColor;

export type MoveDirection = Coord;

export type Coord = {
  row: number;
  col: number;
};

// export type Instantiable<T = any, Args extends unknown[] = unknown[]> = {
//   new (...args: Args): T;
// };

// export type GameStateOfNonInteractivePhase = Extract<
//   GameState,
//   { phase: 'reconcilation' }
// >;

// enum SerializedGameStateBrand {
//   _ = ''
// }
// /**
//  * A String that represents Date w/o Time with this formt: yyyy-mm-dd
//  */
// export type SerializedGameState = SerializedGameStateBrand & string;
