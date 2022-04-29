import { TerrainState } from '../Terrain/types';
import { IdentifiablePieceState } from '../Piece/types';
import { Matrix } from '../types';
import { Piece } from '../Piece/Piece';

export type PieceLayoutState = Matrix<0 | IdentifiablePieceState<string>>; // 0 means no Piece

export type PieceLayout = Matrix<0 | Piece<string>>; // 0 means no Piece

export type BoardState = {
  terrainState: TerrainState;
  pieceLayoutState: PieceLayoutState;

  // This is a derivate of pieceLayout that only exists on the Board Object
  // pieceCoordsById: {
  //   [k: IdentifiablePieceProps['id']]: Coord;
  // };
};
