import React, { useRef, useState } from 'react';
import { PieceInfo } from '../../mahaDosGame/components';
import { PieceState } from '../../gameMechanics/Piece/types';
import { MahaChessTerrain } from '../../mahaDosGame/MahaTerrain';
import { Button } from '../Button';
import {
  GameState,
  isGameStateInMovePhaseWithPartialOrPreparingSubmission,
  Move
} from '../../gameMechanics/Game/types';

type Props = {};

export const MahaGame: React.FC<Props> = () => {
  const [pieceInfo, setPieceInfo] = useState<PieceState>();
  const [movesbyColor, setMovesbyColor] = useState<{
    white: Move[];
    black: Move[];
  }>({
    white: [],
    black: []
  });

  // const gameReconciliator = useRef(new GameReconci)

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div>
        {movesbyColor.black.map((m) => (
          <span>{`${m.piece.label}: ${m.from.row}.${m.from.col} > ${m.to.row}.${m.to.col}, `}</span>
        ))}
        <br />
        <Button label="Submit Black" />
        <br />
        <br />
        <MahaChessTerrain
          onPieceTouched={(piece) => setPieceInfo(piece)}
          onUpdated={(next: GameState) => {
            if (isGameStateInMovePhaseWithPartialOrPreparingSubmission(next)) {
              setMovesbyColor(() => ({
                white: next.white.moves,
                black: next.black.moves
              }));
            }
          }}
        />
        <br />
        <Button primary label="Submit White" />
        <br />
        {movesbyColor.white.map((m) => (
          <span>{`${m.piece.label}: ${m.from.row}.${m.from.col} > ${m.to.row}.${m.to.col}, `}</span>
        ))}
      </div>
      <div
        style={{
          paddingLeft: '2em'
        }}
      >
        {pieceInfo && <PieceInfo piece={pieceInfo} />}
      </div>
    </div>
  );
};

export const Primary = MahaGame.bind({});
