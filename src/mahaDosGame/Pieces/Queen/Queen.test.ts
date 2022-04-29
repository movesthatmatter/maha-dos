import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Queen } from './Queen';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';

test('eval move', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      ['R', 0, 'R', 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 'Q', 'B', 0],
      [0, 'R', 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  };
  const game = new MahaGame(configuration);

  const piece = new Queen(
    generatePieceLabel('black', 'Q', { row: 2, col: 2 }),
    'black'
  );

  const moves = piece.evalMove(game);

  const expectedMoves: Move[] = [
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 2},
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 3 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 0, col: 4 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row:3, col: 3 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 4, col: 4 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 3, col: 2 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 4, col: 2 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 2, col: 1 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 2, col: 0 },
      piece: piece.state
    },
    {
      from: { row: 2, col: 2 },
      to: { row: 1, col: 1 },
      piece: piece.state
    },
  ];

  expect(moves).toEqual(expectedMoves);
});
