import { generatePieceLabel } from 'src/gameMechanics/Board/util';
import { Game } from 'src/gameMechanics/Game/Game';
import {
	GameConfigurator,
	GameHistory,
	GameStateInProgress,
	PartialGameTurn
} from 'src/gameMechanics/Game/types';
import { MahaGame } from '../MahaGame';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { mahaPieceRegistry } from './registry';
import { getAllAdjecentPiecesToPosition, getPieceMoveThisTurn } from './utils';

describe('test getAllAdjecentPiecesToPosition function', () => {
	test('with no pieces', () => {
		const pieceLayout: Game['board']['pieceLayout'] = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];

		const pieces = getAllAdjecentPiecesToPosition(
			{ row: 2, col: 2 },
			pieceLayout
		);

		expect(pieces).toEqual([]);
	});

	test('with position in the middle and few pieces around', () => {
		const pieceLayout: Game['board']['pieceLayout'] = [
			[0, 0, new Queen('white', 'wQ'), 0, 0],
			[0, new Knight('black', 'wB'), 0, 0, 0],
			[0, 0, new Pawn('white', 'wP'), 0, 0],
			[0, 0, 0, 0, 0]
		];

		const pieces = getAllAdjecentPiecesToPosition(
			{ row: 1, col: 2 },
			pieceLayout
		);
		expect(pieces).toEqual([
			{
				state: {
					hitPoints: 20,
					moveRange: 7,
					attackRange: 7,
					attackDamage: 4,
					canAttack: true,
					pieceHasMoved: false,
					color: 'white',
					label: 'Queen',
					movesDirections: [
						{ row: -1, col: 0 },
						{ row: -1, col: 1 },
						{ row: 0, col: 1 },
						{ row: 1, col: 1 },
						{ row: 1, col: 0 },
						{ row: 1, col: -1 },
						{ row: 0, col: -1 },
						{ row: -1, col: -1 }
					],
					maxHitPoints: 20,
					canDie: true,
					id: 'wQ'
				}
			},
			{
				state: {
					hitPoints: 6,
					attackRange: 1,
					attackDamage: 1,
					canAttack: true,
					moveRange: 2,
					pieceHasMoved: false,
					color: 'white',
					label: 'Pawn',
					movesDirections: [{ row: -1, col: 0 }],
					attackDirection: [
						{ row: -1, col: 1 },
						{ row: -1, col: -1 }
					],
					maxHitPoints: 6,
					canDie: true,
					id: 'wP'
				}
			},
			{
				state: {
					hitPoints: 12,
					moveRange: 1,
					attackRange: 1,
					attackDamage: 2,
					canAttack: true,
					pieceHasMoved: false,
					color: 'black',
					label: 'Knight',
					movesDirections: [
						{ row: -2, col: 1 },
						{ row: -1, col: 2 },
						{ row: 1, col: 2 },
						{ row: 2, col: 1 },
						{ row: 2, col: -1 },
						{ row: 1, col: -2 },
						{ row: -1, col: -2 },
						{ row: -2, col: -1 }
					],
					maxHitPoints: 12,
					canDie: true,
					id: 'wB'
				}
			}
		]);
	});

	test('with position in the corner and few pieces around', () => {
		const pieceLayout: Game['board']['pieceLayout'] = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[new Knight('black', 'wB'), new Pawn('white', 'wP'), 0, 0, 0],
			[0, new Queen('white', 'wQ'), 0, 0, 0]
		];

		const pieces = getAllAdjecentPiecesToPosition(
			{ row: 3, col: 0 },
			pieceLayout
		);
		expect(pieces).toEqual([
			{
				state: {
					hitPoints: 12,
					moveRange: 1,
					attackRange: 1,
					attackDamage: 2,
					canAttack: true,
					pieceHasMoved: false,
					color: 'black',
					label: 'Knight',
					movesDirections: [
						{ row: -2, col: 1 },
						{ row: -1, col: 2 },
						{ row: 1, col: 2 },
						{ row: 2, col: 1 },
						{ row: 2, col: -1 },
						{ row: 1, col: -2 },
						{ row: -1, col: -2 },
						{ row: -2, col: -1 }
					],
					maxHitPoints: 12,
					canDie: true,
					id: 'wB'
				}
			},
			{
				state: {
					hitPoints: 6,
					attackRange: 1,
					attackDamage: 1,
					canAttack: true,
					moveRange: 2,
					pieceHasMoved: false,
					color: 'white',
					label: 'Pawn',
					movesDirections: [{ row: -1, col: 0 }],
					attackDirection: [
						{ row: -1, col: 1 },
						{ row: -1, col: -1 }
					],
					maxHitPoints: 6,
					canDie: true,
					id: 'wP'
				}
			},
			{
				state: {
					hitPoints: 20,
					moveRange: 7,
					attackRange: 7,
					attackDamage: 4,
					canAttack: true,
					pieceHasMoved: false,
					color: 'white',
					label: 'Queen',
					movesDirections: [
						{ row: -1, col: 0 },
						{ row: -1, col: 1 },
						{ row: 0, col: 1 },
						{ row: 1, col: 1 },
						{ row: 1, col: 0 },
						{ row: 1, col: -1 },
						{ row: 0, col: -1 },
						{ row: -1, col: -1 }
					],
					maxHitPoints: 20,
					canDie: true,
					id: 'wQ'
				}
			}
		]);
	});
});

describe('test getPieceMovethisTurn function', () => {
	test('with no piece movement', () => {
		const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
			terrain: { width: 5 },
			pieceLayout: [
				[0, 0, 'bP', 0, 0, 0],
				['bP', 0, 'wK', 0, 'bP', 0],
				[0, 0, 0, 'bP', 0, 0],
				['bP', 0, 'wQ', 0, 0, 'bN'],
				[0, 0, 0, 'wP', 0, 0],
				[0, 0, 'bQ', 0, 0, 0]
			]
		};
		const game = new MahaGame(configuration);
		const move = getPieceMoveThisTurn(
			new Queen('white', generatePieceLabel('white', 'wQ', { row: 3, col: 2 })),
			game
		);
		expect(move).toBeUndefined();
	});
	test('with piece movement', () => {
		const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
			terrain: { width: 5 },
			pieceLayout: [
				[0, 0, 'bP', 0, 0, 0],
				['bP', 0, 'wK', 0, 'bP', 0],
				[0, 0, 0, 'bP', 0, 0],
				['bP', 0, 'wQ', 0, 0, 'bN'],
				[0, 0, 0, 'wP', 0, 0],
				[0, 0, 'bQ', 0, 0, 0]
			]
		};
		const trackedPiece = new Queen(
			'white',
			generatePieceLabel('white', 'wQ', { row: 3, col: 2 })
		);
		const game = new MahaGame(configuration);

		const turn: PartialGameTurn = [
			{
				black: [
					{
						from: { row: 0, col: 0 },
						to: { row: 1, col: 0 },
						piece: new Pawn('black', 'bP').state
					}
				],
				white: [
					{
						from: { row: 5, col: 4 },
						to: { row: 3, col: 2 },
						piece: trackedPiece.state
					}
				]
			},
			{
				white: [],
				black: []
			}
		];
		const history: GameHistory = [[...turn]];
		const { state } = game;
		game.load({ ...state, history } as GameStateInProgress);

		const move = getPieceMoveThisTurn(trackedPiece, game);
		expect(move).toEqual({
			from: { row: 5, col: 4 },
			to: { row: 3, col: 2 },
			piece: trackedPiece.state
		});
	});
	test('with other pieces movement', () => {
		const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
			terrain: { width: 5 },
			pieceLayout: [
				[0, 0, 'bP', 0, 0, 0],
				['bP', 0, 'wK', 0, 'bP', 0],
				[0, 0, 0, 'bP', 0, 0],
				['bP', 0, 'wQ', 0, 0, 'bN'],
				[0, 0, 0, 'wP', 0, 0],
				[0, 0, 'bQ', 0, 0, 0]
			]
		};
		const trackedPiece = new Queen(
			'white',
			generatePieceLabel('white', 'wQ', { row: 3, col: 2 })
		);
		const game = new MahaGame(configuration);

		const turn: PartialGameTurn = [
			{
				black: [
					{
						from: { row: 0, col: 0 },
						to: { row: 1, col: 0 },
						piece: new Pawn('black', 'bP').state
					}
				],
				white: [
					{
						from: { row: 5, col: 4 },
						to: { row: 2, col: 2 },
						piece: new Pawn('white', 'wP').state
					}
				]
			},
			{
				white: [],
				black: []
			}
		];
		const history: GameHistory = [[...turn]];
		const { state } = game;
		game.load({ ...state, history } as GameStateInProgress);

		const move = getPieceMoveThisTurn(trackedPiece, game);
		expect(move).toBeUndefined();
	});

	test('with piece movement but not this turn', () => {
		const configuration: GameConfigurator<typeof mahaPieceRegistry> = {
			terrain: { width: 5 },
			pieceLayout: [
				[0, 0, 'bP', 0, 0, 0],
				['bP', 0, 'wK', 0, 'bP', 0],
				[0, 0, 0, 'bP', 0, 0],
				['bP', 0, 'wQ', 0, 0, 'bN'],
				[0, 0, 0, 'wP', 0, 0],
				[0, 0, 'bQ', 0, 0, 0]
			]
		};
		const trackedPiece = new Queen(
			'white',
			generatePieceLabel('white', 'wQ', { row: 3, col: 2 })
		);
		const game = new MahaGame(configuration);

		const turn: PartialGameTurn = [
			{
				black: [
					{
						from: { row: 0, col: 0 },
						to: { row: 1, col: 0 },
						piece: new Pawn('black', 'bP').state
					}
				],
				white: [
					{
						from: { row: 5, col: 4 },
						to: { row: 2, col: 2 },
						piece: new Pawn('white', 'wP').state
					}
				]
			},
			{
				white: [],
				black: []
			}
		];
		const history: GameHistory = [
			[
				{
					black: [
						{
							from: { row: 0, col: 0 },
							to: { row: 1, col: 0 },
							piece: new Pawn('black', 'bP').state
						}
					],
					white: [
						{
							from: { row: 5, col: 4 },
							to: { row: 3, col: 2 },
							piece: trackedPiece.state
						}
					]
				},
				{
					white: [],
					black: []
				}
			],
			[...turn]
		];
		const { state } = game;
		game.load({ ...state, history } as GameStateInProgress);

		const move = getPieceMoveThisTurn(trackedPiece, game);
		expect(move).toBeUndefined();
	});
});
