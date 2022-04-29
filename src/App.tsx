import './styles.css';
import { ChessTerrain } from './ChessTerrain';
import { MahaGame } from './mahaDosGame/MahaGame';
import { PieceState } from './gameMechanics/Piece/types';
import { useRef, useState } from 'react';
import { matrixInsert, matrixInsertMany } from './gameMechanics/util';
import {
  GameStateInMovePhaseWithPartialSubmission,
  GameStateInMovePhaseWithPreparingSubmission,
  isGameStateInMovePhaseWithPartialSubmission,
  isGameStateInMovePhaseWithPreparingSubmission
} from './gameMechanics/Game/types';

export default function App() {
  const [pieceInfo, setPieceInfo] = useState<PieceState<string>>();

  const gameRef = useRef(new MahaGame());
  const [gameState, setGameState] = useState(gameRef.current.state);

  return (
    <div className="App">
      <div
        style={{
          marginLeft: '100px',
          display: 'flex'
        }}
      >
        <ChessTerrain
          sizePx={500}
          board={gameState.boardState}
          arrows={
            isGameStateInMovePhaseWithPreparingSubmission(gameState)
              ? [...gameState.white.moves, ...gameState.black.moves]
              : undefined
          }
          onTouch={(coord, piece) => {
            console.log('touched puece', coord, piece);
            setPieceInfo(piece);
          }}
          onMove={(move) => {
            // TODO: This is definitely not the nd ode -neeeds to be refactored and tested!!
            setGameState((prev) => {
              if (prev.state === 'completed') {
                return prev;
              }

              // const prevPiece = move.piece.
              const nextPieceLayoutState = matrixInsertMany(
                prev.boardState.pieceLayoutState,
                [
                  // {
                  //   index: [move.from.row, move.from.col],
                  //   nextVal: 0
                  // },
                  // {
                  //   index: [move.to.row, move.to.col],
                  //   nextVal: move.piece
                  // }
                ]
              );

              const preparing: GameStateInMovePhaseWithPreparingSubmission = {
                ...prev,
                state: 'inProgress',
                boardState: prev.boardState,
                history: prev.history,
                winner: undefined,
                // boardState: {
                //   ...prev.boardState,
                //   pieceLayoutState: nextPieceLayoutState
                // },

                phase: 'move',
                submissionStatus: 'preparing',

                // ...
                ...(isGameStateInMovePhaseWithPreparingSubmission(prev)
                  ? {
                      white: prev.white,
                      black: prev.black
                    }
                  : {
                      white: {
                        canDraw: true,
                        moves: []
                      },
                      black: {
                        canDraw: true,
                        moves: []
                      }
                    })

                // [move.piece.color]: {

                // },
              };

              // const merged = {
              //   ...defaultPreparing,
              //   ...prev
              // };

              return {
                ...preparing,
                ...(isGameStateInMovePhaseWithPreparingSubmission(
                  preparing
                ) && {
                  white: {
                    ...preparing.white,
                    ...(move.piece.color === 'white' && {
                      moves: [...preparing.white.moves, move]
                    })
                  },
                  black: {
                    ...preparing.white,
                    ...(move.piece.color === 'black' && {
                      moves: [...preparing.black.moves, move]
                    })
                  }
                })
              };
            });

            console.log('move', move);
          }}
        />
        <div>
          <pre>{JSON.stringify(pieceInfo, null, 2)}</pre>
        </div>
      </div>
      <pre>{JSON.stringify((gameState as any).white, null, 2)}</pre>
      <pre>{JSON.stringify((gameState as any).black, null, 2)}</pre>
    </div>
  );
}
