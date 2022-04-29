import './styles.css';
import { ChessTerrain } from './ChessTerrain';
import { MahaGame } from './mahaDosGame/MahaGame';
import { PieceState } from './gameMechanics/Piece/types';
import { useRef, useState } from 'react';
import { matrixInsert, matrixInsertMany } from './gameMechanics/util';

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
          onTouch={(coord, piece) => {
            console.log('touched puece', coord, piece);
            setPieceInfo(piece);
          }}
          onMove={(move) => {
            setGameState((prev) => {
              // const prevPiece = move.piece.
              const nextPieceLayoutState = matrixInsertMany(
                prev.boardState.pieceLayoutState,
                [
                  {
                    index: [move.from.row, move.from.col],
                    nextVal: 0
                  },
                  {
                    index: [move.to.row, move.to.col],
                    nextVal: move.piece
                  }
                ]
              );

              return {
                ...prev,
                boardState: {
                  ...prev.boardState,
                  pieceLayoutState: nextPieceLayoutState
                }
              };
            });

            console.log('move', move);
          }}
        />
        <div>
          <pre>{JSON.stringify(pieceInfo, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
