import { Game } from 'src/gameMechanics/Game/Game';
import { Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import { TerrainProps } from 'src/gameMechanics/Terrain/Terrain';
import { Coord, MoveDirection, range } from 'src/gameMechanics/util';

export function evalEachDirectionForMove(
	from: Coord,
	piece: Piece,
	game: Game
): Move[] {
	const moves: Move[] = [];
	piece.state.movesDirections.map((dir) => {
		let hitObstacle = false;
		range(piece.state.moveRange, 1).map((r) => {
			if (hitObstacle) {
				return;
			}
			const targetSq: Coord = {
				row: from.row + dir.row * r,
				col: from.col + dir.col * r
			};
			if (
				targetSq.row >= game.board.pieceLayout.length ||
				targetSq.col >= game.board.pieceLayout[0].length ||
				targetSq.row < 0 ||
				targetSq.col < 0
			) {
				return;
			}
			if (game.board.pieceLayout[targetSq.row][targetSq.col] === 0) {
				const move: Move = {
					from,
					to: targetSq,
					piece: piece.state
				};
				moves.push(move);
			} else {
				hitObstacle = true;
				return;
			}
		});
	});
	return moves;
}
