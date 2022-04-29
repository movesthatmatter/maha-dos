export const x = 1;

// import { Err, Ok, Result } from 'ts-results';
// import { Coord, GameState, GameStateInAttackPhase, GameStateInMovePhase, Move, IdentifiablePieceProps, SerializedGameState } from './types';
// // import { Piece } from './Piece';
// // import { Terrain } from './terrain';
// // import { deserializeGameState } from './util';
// import { MoveNotPossibleError } from './engine/errors';


// // type Errors = GameStateNotInMovePhaseError | GameStateNotInAttachPhaseError;



// class PlanningEngine {
//   // private piecesMap: {
//   //   SerializedCoord: Pawn,
//   //   SerializedCoord: WhiteKnight,
//   //   SerializedCoord: BlackKnight,
//   //   ...
//   // }

//   private gameState: GameState;
  
//   // private moves: Move[];
  
//   // private attacks: Attack[];

//   constructor(serializedGameState?: SerializedGameState) {
//     deserializeGameState(serializedGameState || '')
//       .map((gameState) => {
//         this.gameState = gameState;
//       })
//       .mapErr(() => {
//         this.gameState = {
//           board: {},
//           phase: 'move',
//           moves: [],
//         }
//       })

//     // this.gameState = 
//   }

//   private piecesById: {
//     [id: IdentifiablePieceProps['id']]: Piece;
//   }

//   move(gameState: GameState, from: Coord, to: Coord): Result<Move, MoveNotPossibleError> {
//     const pieceAtOrig = gameState.board.pieceLayout[from.x][from.x];
    
//     if (!pieceAtOrig) {
//       return new Err({
//         type: 'MoveNotPossible',
//         // TODO: This could actually be an Error type with a reason
//         content: undefined,
//       });
//     }

//     const piece = this.piecesById[pieceAtOrig.id];

//     if (!piece) {
//       return new Err({
//         type: 'MoveNotPossible',
//         // TODO: This could actually be an Error type with a reason
//         content: undefined,
//       });
//     }

//     const allPossibleDests = piece.evalMove(gameState);

//     // validate this move is legal
//     if (!allPossibleDests.find((move) => move.x === from.x && move.y === from.y)) {
//       return new Err({
//         type: 'MoveNotPossible',
//         // TODO: This could actually be an Error type with a reason
//         content: undefined,
//       });
//     }

//     return new Ok({
//       from,
//       to,
//       piece: piece.props,
//     });
//   }

  
//   attack(currentSq: Coord, nextSq: Coord) {

//   }

//   submitPlannedMoves(plannedGameState: GameState): GameState {
//     // sends to the server
//   }

//   reconcileMoves() {

//   }

  

//   setNextGameState(coord: Coord, destination: Coord): GameState {
//     this.piecesMap = this.piecesMap[coord.serialize()].evalMove(this.gameState, destination);
//     this. = this.piecesMap[coord.serialize()].evalStats(this.gameState, destination);
//     return this.gameState;
//   }

//   getGameState() {
//     return {
//       phase: 'attack' | 'move';
//       pieceConfiguration: [
//         [1, {
//           PawnPiece;
//           canAttack: boolean;
//         }, 1, 1, 0, KingPiece],
//         [PawnPiece, 1, 0, 0, QueenPice],
//         ...
//       ]
//     }
//   }

//   serialize(): GameStateAsJson {

//   }
// }
