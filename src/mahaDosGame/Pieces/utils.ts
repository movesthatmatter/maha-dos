import { Game } from '../../gameMechanics/Game/Game';
import { Move } from '../../gameMechanics/Game/types';
import { Piece } from '../../gameMechanics/Piece/Piece';
import { Coord, range } from '../../gameMechanics/util';

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
				targetSq.row >= game.board.state.pieceLayoutState.length ||
				targetSq.col >= game.board.state.pieceLayoutState[0].length ||
				targetSq.row < 0 ||
				targetSq.col < 0
			) {
				return;
			}
			if (game.board.state.pieceLayoutState[targetSq.row][targetSq.col] === 0) {
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
