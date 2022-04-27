import { Terrain } from './terrain';

export type Color = 'white' | 'black';

export type MovesDirection = { x: number; y: number };

export type Coord = {
  x: number;
  y: number;
};

export type PieceProps = {
  type: string; // king, beserk king, queen, knight, whateber else
  color: Color;
  health: number;
  movesDirections: MovesDirection[];
  range: number;
  canAttack: boolean;
  hitPoints: number;
};

export type IdentifiablePieceProps = {
  id: string; // color-pieceName-uniqueNumber
} & PieceProps;

export type PiecesLayout = (0 | IdentifiablePieceProps)[][];

export type BoardState = {
  terrain: Terrain;
  pieceLayout: PiecesLayout; // 0 means no Piece

  // This is a derivate of pieceLayout
  pieceCoordsById: {
    [k: IdentifiablePieceProps['id']]: Coord;
  };
};

export type Move = {
  from: Coord;
  to: Coord;
  piece: PieceProps;
  promotion?: PieceProps['type'];
};

export type AttackType = 'melee' | 'range';

export type Attack = {
  from: Coord;
  to: Coord;
  attackType: AttackType;
} & (
  | {
      outcome: 'damage';
      damage: number;
    }
  | {
      outcome: 'kill';
      killedPiece: PieceProps;
    }
);

export type GameState = {
  board: BoardState;
} & (
  | {
      phase: 'move';
      nextMoves: Move[];
    }
  // |
  // {
  //   phase: 'reconsiliation'
  //   nextPhase: 'attack' | 'move';
  // }
  | {
      phase: 'attack';
      nextAttacks: Attack[];
    }
  // |
  // {
  //     // This is the in-between phase where there is no user interaction
  //     // phase: 'reconcilation' | '';
  //   }
);

export type GameStateInMovePhase = Extract<GameState, { phase: 'move' }>;
export type GameStateInAttackPhase = Extract<GameState, { phase: 'attack' }>;
// export type GameStateOfNonInteractivePhase = Extract<
//   GameState,
//   { phase: 'reconcilation' }
// >;

enum SerializedGameStateBrand {
  _ = ''
}
/**
 * A String that represents Date w/o Time with this formt: yyyy-mm-dd
 */
export type SerializedGameState = SerializedGameStateBrand & string;

export type SerializedCoords = string;

export type GameStateNotInMovePhaseError = {
  type: 'GameStateNotInMovePhase';
  content: undefined;
};

export type GameStateNotInAttackPhaseError = {
  type: 'GameStateNotInAttackPhase';
  content: undefined;
};

export type EventsMap = Record<string, Event>;
