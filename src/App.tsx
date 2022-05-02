import './styles.css';
import { PieceState } from './gameMechanics/Piece/types';
import { useState } from 'react';
import { MahaChessTerrain } from './mahaDosGame/components/MahaTerrain';

export default function App() {
  const [pieceInfo, setPieceInfo] = useState<PieceState<string>>();

  return (
    <div className="App">
      <div
        style={{
          marginLeft: '100px',
          display: 'flex'
        }}
      >
        {/* <MahaChessTerrain onPieceTouched={(piece) => setPieceInfo(piece)} /> */}
        <div>
          <pre>{JSON.stringify(pieceInfo, null, 2)}</pre>
        </div>
      </div>
      {/* <pre>{JSON.stringify((gameState as any).white, null, 2)}</pre>
      <pre>{JSON.stringify((gameState as any).black, null, 2)}</pre> */}
    </div>
  );
}
