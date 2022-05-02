import { MahaGame } from 'src/mahaDosGame/MahaGame';
import { Knight } from './Knight';
import { GameConfigurator, Move } from 'src/gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';
import { generatePieceLabel } from 'src/gameMechanics/Board/util';

test('eval move', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      ['R', 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 'P', 0, 0, 0],
      [0, 0, 0, 'P', 0],
      [0, 'B', 'N', 0, 0]
    ]
  };
  const game = new MahaGame(configuration);

  const piece = new Knight(
    generatePieceLabel('white', 'N', { row: 4, col: 2 }),
    'white'
  );

  const moves = piece.evalMove(game);

  const expectedMoves: Move[] = [
    {
      from: { row: 4, col: 2 },
      to: { row: 2, col: 3},
      piece: piece.state
    },
    {
      from: { row: 4, col: 2 },
      to: { row: 3, col: 4 },
      piece: piece.state
    },
    {
      from: { row: 4, col: 2 },
      to: { row:3, col: 0 },
      piece: piece.state
    },
  ];

  expect(moves).toEqual(expectedMoves);
});
