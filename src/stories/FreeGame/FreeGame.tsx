import React, { useState } from 'react';
import { PieceState } from '../../gameMechanics/Piece/types';
import { PieceInfo } from '../../mahaDosGame/components/PieceInfo';
import { Button } from '../Button';
import {
  isGameStateInMovePhaseWithPartialOrPreparingSubmission,
  Move
} from '../../gameMechanics/Game/types';
import { Maha } from '../../mahaDosGame/components/Maha';

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
        <Maha
          // gameState={}
          onSubmit={() => {
            console.log('on submit');
          }}
          onPieceTouched={(piece) => setPieceInfo(piece)}
          onMoveDrawn={(next) => {
            if (
              isGameStateInMovePhaseWithPartialOrPreparingSubmission(
                next.gameState
              )
            ) {
              setMovesbyColor({
                white: next.gameState.white.moves,
                black: next.gameState.black.moves
              });
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
          paddingLeft: '2em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {pieceInfo && <PieceInfo piece={pieceInfo} />}
      </div>
    </div>
  );
};

export const Primary = MahaGame.bind({});
