// Take out in favor of BoardCoord
export type Coord = {
  row: number;
  col: number;
};

export type BoardCoord = Coord;

export type BoardVector = {
  from: BoardCoord;
  to: BoardCoord;
};

export type PointCoord = {
  x: number;
  y: number;
};

export type LineVector = {
  from: PointCoord;
  to: PointCoord;
};
