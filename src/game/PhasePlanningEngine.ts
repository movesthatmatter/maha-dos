import { Attack, AttackType, BoardState, Coord, GameState, IdentifiablePieceProps, Move, SerializedGameState } from "./types";
import { deserializeGameState, getPieceCurrentHealth, getPieceDamage, serializeCoord } from "./util";
import {Knight} from './Pieces/Knight';
import { Piece } from "./Pieces/Piece";

class PhasePlanningEngine {
  private piecesMap: {
    SerializedCoord: Knight,
  }

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
          board: {} as BoardState,
          phase: 'move',
          moves: [] as Move[],
        } as unknown as GameState
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

  
  attack(gameState: GameState, currentSq: Coord, nextSq: Coord, attackType: AttackType): Attack | undefined {
    const pieceAtOrig = gameState.board.pieceLayout[currentSq.x][currentSq.y];
    const pieceAtDest = gameState.board.pieceLayout[nextSq.x][nextSq.y];

    if ((pieceAtDest === 0) || (pieceAtOrig === 0)) {
      return undefined;
    }

    const damageDealt = getPieceDamage(pieceAtOrig);
    const attackedPieceHealth = getPieceCurrentHealth(pieceAtDest);
    const updatedHealthAfterAttack = attackedPieceHealth - damageDealt;

    if (updatedHealthAfterAttack > 0) {
      return {
        attackType,
        from: currentSq,
        to: nextSq,
        outcome: 'damage',
        damage: damageDealt
      }
    }

    return {
      attackType,
      from: currentSq,
      to: nextSq,
      outcome: 'kill',
      killedPiece: pieceAtDest
    }
    
  }

  submitPlannedMoves(plannedGameState: GameState): GameState {
    // sends to the server
    return {} as GameState
  }

  reconcileMoves() {}

  

  setNextGameState(coord: Coord, destination: Coord): GameState {
    this.piecesMap = this.piecesMap[serializeCoord(coord)].evalMove(this.gameState, destination);
    return this.gameState;
  }

  getGameState(): GameState {
    return {
      phase: 'attack' | 'move',
      pieceConfiguration: [
        [1, {
          PawnPiece;
          canAttack: boolean;
        }, 1, 1, 0, KingPiece],
        [PawnPiece, 1, 0, 0, QueenPice],
        ...
      ]
    } as unknown as  GameState
  }

  serialize(): string {
    return JSON.stringify(this.gameState) 
  }
}