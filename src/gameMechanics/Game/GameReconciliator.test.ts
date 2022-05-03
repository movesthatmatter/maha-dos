import { GameStateCompleted, GameStatePending } from './types';
import { Game } from './Game';
import { generate } from '../../mahaDosGame/helpers';
import { mahaPieceRegistry } from '../../mahaDosGame/Pieces/registry';
import { generatePieceLabel } from '../Board/util';
import {
  GameTurn,
  FullGameTurn,
  PartialGameTurn,
  PartialGameTurnAttackPhase,
  PartialGameTurnMovePhase,
  Move,
  Attack
} from './types';

describe('submitMoves', () => {
  test('asd', () => {
    expect(1).toBe(1);
  })
});
