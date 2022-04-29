// import { Terrain, TerrainState } from './terrain';

import { Piece } from './Piece/Piece';
import { IdentifiablePieceState, PieceDynamicProps } from './Piece/types';
import { TerrainProps } from './Terrain/Terrain';

// This is used to generate the board and piece layout
export type Matrix<T> = T[][];

// import { PieceState } from './Piece';

export type WhiteColor = 'white';
export type BlackColor = 'black';
export type Color = WhiteColor | BlackColor;
export type ShortColor = 'w' | 'b';

export type MoveDirection = Coord;

export type Coord = {
  x: number;
  y: number;
};

// export type Instantiable<T = any, Args extends unknown[] = unknown[]> = {
//   new (...args: Args): T;
// };

export type PieceFactory = (
  id: IdentifiablePieceState<'Knight'>['id'],
  color: Color,
  dynamicProps?: PieceDynamicProps
) => Piece;

export type PieceRegistry = Record<string, PieceFactory>;

export type GameConfigurator<PR extends PieceRegistry> = {
  terrain: TerrainProps;
  pieceLayout: Matrix<keyof PR | 0>;
};

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
