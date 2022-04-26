import isObject from 'isobject';
import { Err, Ok, Result } from 'ts-results';
import {
  BoardState,
  Coord,
  GameState,
  PieceProps,
  SerializedGameState
} from './types';

export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);

export const getPieceBySquare = ({
  sq,
  board
}: {
  sq: Coord;
  board: BoardState['pieceLayout'];
}): PieceProps | undefined => {
  const piece = board[sq.x][sq.y];
  return piece !== 0 ? (piece as PieceProps) : undefined;
};

export const serializeGameState = (s: GameState): SerializedGameState => {
  // TODO: Ensure this actually gets serialized correctly
  return JSON.stringify(s) as SerializedGameState;

  // Could do some nested serializers
  // return s.board.terrain[0][0].;
};

export const isGameState = (obj: object): obj is GameState => {
  // TODO: Ensure the actual given string is an actual real GameState
  return !!(isObject(obj) && 'board' in obj && 'phase' in obj);
};

export const isSerializedGameState = (
  str: string
): str is SerializedGameState => {
  try {
    return isGameState(JSON.parse(str));
  } catch (_) {
    return false;
  }
};

export const deserializeGameState = (str: string): Result<GameState, void> => {
  if (!isSerializedGameState(str)) {
    return Err.EMPTY;
  }

  // Here i reparse the json
  return new Ok(JSON.parse(str) as GameState);
};
