import { MahaGame } from '../../MahaGame';
import { GameConfigurator, Move } from '../../../gameMechanics/Game/types';
import { mahaPieceRegistry } from '../registry';

test('eval move', () => {
  const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
    terrain: { width: 5 },
    pieceLayout: [
      ['bR', 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 'bP', 0, 0, 0],
      [0, 0, 0, 'bP', 0],
      [0, 'wB', 'wN', 0, 0]
    ]
  };
  const game = new MahaGame(configuration);

  const piece = game.board.getPieceByCoord({ row: 4, col: 2 });

    expect(piece).toBeDefined();

    if (!piece) {
      return;
    }

  const moves = piece.evalMove(game);

  const expectedMoves: Move[] = [
    {
      from: { row: 4, col: 2 },
      to: { row: 2, col: 3 },
      piece: piece.state
    },
    {
      from: { row: 4, col: 2 },
      to: { row: 3, col: 4 },
      piece: piece.state
    },
    {
      from: { row: 4, col: 2 },
      to: { row: 3, col: 0 },
      piece: piece.state
    }
  ];

  expect(moves).toEqual(expectedMoves);
});
