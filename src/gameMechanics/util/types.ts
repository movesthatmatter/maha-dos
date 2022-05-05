export type WhiteColor = 'white';
export type BlackColor = 'black';
export type Color = WhiteColor | BlackColor;

export type ShortWhiteColor = 'w';
export type ShortBlackColor = 'b';
export type ShortColor = ShortWhiteColor | ShortBlackColor;

export type MoveDirection = Coord;

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
