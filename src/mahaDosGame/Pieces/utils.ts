import { Game } from 'src/gameMechanics/Game/Game';
import { Move } from 'src/gameMechanics/Game/types';
import { Piece } from 'src/gameMechanics/Piece/Piece';
import { TerrainProps } from 'src/gameMechanics/Terrain/Terrain';
import { Coord, MoveDirection, range } from 'src/gameMechanics/util';
import { toDictIndexedBy } from 'src/gameMechanics/utils';

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

export function getAllAdjecentPiecesToPosition(
	pos: Coord,
	pieceLayout: Game['board']['pieceLayout']
): Piece[] {
	return [
		{ row: -1, col: 0 },
		{ row: -1, col: 1 },
		{ row: 0, col: 1 },
		{ row: 1, col: 1 },
		{ row: 1, col: 0 },
		{ row: 1, col: -1 },
		{ row: 0, col: -1 },
		{ row: -1, col: -1 }
	].reduce((accum, dir) => {
		const target: Coord = { row: pos.row + dir.row, col: pos.col + dir.col };
		if (
			target.row >= pieceLayout.length ||
			target.col >= pieceLayout[0].length ||
			target.row < 0 ||
			target.col < 0
		) {
			return accum;
		}
		const targetPiece = pieceLayout[target.row][target.col];
		if (targetPiece === 0) {
			return accum;
		}
		return [...accum, targetPiece];
	}, [] as Piece[]);
}

export function getPieceMoveThisTurn(
	piece: Piece,
	game: Game
): Move | undefined {
	const { history } = game.state;
	if (
		history &&
		history.length > 0 &&
		typeof history[history.length - 1][0][piece.state.color] !== 'undefined'
	) {
		const movesByPieceId = toDictIndexedBy(
			history[history.length - 1][0][piece.state.color] as Move[],
			(move) => move.piece.id
		);
		if (piece.state.id in movesByPieceId) {
			return movesByPieceId[piece.state.id];
		}
	}
	return undefined;
}
