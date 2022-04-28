// import { Terrain, TerrainState } from './terrain';

// import { PieceState } from './Piece';

export type WhiteColor = 'white';
export type BlackColor = 'black';
export type Color = WhiteColor | BlackColor;

export type MoveDirection = Coord;

export type Coord = {
  x: number;
  y: number;
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
