import { Err, Ok, Result } from 'ts-results';
import { Coord, GameState, GameStateInAttackPhase, GameStateInMovePhase, Move, IdentifiablePieceProps, SerializedGameState } from './types';
import { Piece } from './Pieces/Piece';
import { Terrain } from './terrain';
import { deserializeGameState } from './util';

type GameStateNotInMovePhaseError = {
  type: 'GameStateNotInMovePhase';
  content: undefined;
}

type GameStateNotInAttackPhaseError = {
  type: 'GameStateNotInAttackPhase';
  content: undefined;
}

// type Errors = GameStateNotInMovePhaseError | GameStateNotInAttachPhaseError;

class ReconciliatingEngine {
  reconcileMoves(
    prevState: GameState,
    whiteMoves: GameStateInMovePhase['nextMoves'],
    blackMoves: GameStateInMovePhase['nextMoves']
  ): Result<GameStateInAttackPhase, GameStateNotInMovePhaseError> {
    if (prevState.phase !== 'attack') {
      return new Err({
        type: 'GameStateNotInMovePhase',
        content: undefined,
      });
    }

    return new Ok({
      board: {
        ...prevState.board,
        // TODO: Actually reconcile
      }, 
      phase: 'attack',
      nextAttacks: [],
    })
  }

  reconcileAttacks(
    prevState: GameState,
    whiteAttacks: GameStateInAttackPhase['nextAttacks'],
    blackAttack: GameStateInAttackPhase['nextAttacks']
  ): Result<GameStateInMovePhase, GameStateNotInAttackPhaseError> {
    if (prevState.phase !== 'attack') {
      return new Err({
        type: 'GameStateNotInAttackPhase',
        content: undefined,
      });
    }

    return new Ok({
      board: {
        ...prevState.board,
        // TODO: Actually reconcile
      }, 
      phase: 'move',
      nextMoves: [],
    })
  }
}

class PlanningEngine {
  // private piecesMap: {
  //   SerializedCoord: Pawn,
  //   SerializedCoord: WhiteKnight,
  //   SerializedCoord: BlackKnight,
  //   ...
  // }

  private gameState: GameState;
  
  // private moves: Move[];
  
  // private attacks: Attack[];

  constructor(serializedGameState?: SerializedGameState) {
    deserializeGameState(serializedGameState || '')
      .map((gameState) => {
        this.gameState = gameState;
      })
      .mapErr(() => {
        this.gameState = {
          board: {},
          phase: 'move',
          moves: [],
        }
      })

    // this.gameState = 
  }

  private piecesById: {
    [id: IdentifiablePieceProps['id']]: Piece;
  }

  // TODO: The move method can live in the engine as
  // only it calls the specific piece evalMove
  move(gameState: GameState, from: Coord, to: Coord): Move | undefined {
    const pieceAtOrig = gameState.board.pieceLayout[from.x][from.x];
    
    if (!pieceAtOrig) { return undefined }

    const piece = this.piecesById[pieceAtOrig.id];

    if (!piece) {
      return undefined;
    }

    const allPossibleDests = piece.evalMove(gameState);

    // validate this move is legal

    if (!allPossibleDests.find((move) => move.x === from.x && move.y === from.y)) {
      return undefined;
    }

    return {
      from,
      to,
      piece: piece.serialize(),
    };
  }

  
  attack(currentSq: Coord, nextSq: Coord) {

  }

  submitPlannedMoves(plannedGameState: GameState): GameState {
    // sends to the server
  }

  reconcileMoves() {

  }

  

  setNextGameState(coord: Coord, destination: Coord): GameState {
    this.piecesMap = this.piecesMap[coord.serialize()].evalMove(this.gameState, destination);
    this. = this.piecesMap[coord.serialize()].evalStats(this.gameState, destination);
    return this.gameState;
  }

  getGameState() {
    return {
      phase: 'attack' | 'move';
      pieceConfiguration: [
        [1, {
          PawnPiece;
          canAttack: boolean;
        }, 1, 1, 0, KingPiece],
        [PawnPiece, 1, 0, 0, QueenPice],
        ...
      ]
    }
  }

  serialize(): GameStateAsJson {

  }
}
