import { Game } from 'src/gameMechanics/Game/Game';
import { generate } from '../helpers';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { getAllAdjecentPiecesToPosition } from './utils';

describe('get all adjecent pieces to a certain position', () => {
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
		console.log('pieces', pieces);
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
		console.log('pieces', pieces);
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
