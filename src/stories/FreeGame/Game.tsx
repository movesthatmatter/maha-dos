import React, { useState } from 'react';
import { PieceState } from '../../gameMechanics/Piece/types';
import { PieceInfo } from '../../mahaDosGame/components/PieceInfo';
import {
  isGameInMovePhaseWithPartialOrPreparingSubmission,
  Move
} from '../../gameMechanics/Game/types';
import { Maha, MahaProps } from '../../mahaDosGame/components/Maha';
import { Color } from '../../gameMechanics/util';
import { Button } from '../../mahaDosGame/components/Button';

type Props = {
  color: Color;
  onSubmitMoves: MahaProps['onSubmitMoves'];
};

export const MahaGame: React.FC<Props> = (props) => {
  const [pieceInfo, setPieceInfo] = useState<PieceState>();
  const [myMoves, setMyMoves] = useState<Move[]>();

  // const gameReconciliator = useRef(new GameReconci)

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div>
        <Maha
          // gameState={}
          canInteract
          onSubmitMoves={props.onSubmitMoves}
          onSubmitAttacks={() => {
            console.log('on sumit attack ');
          }}
          playingColor={props.color}
          onPieceTouched={(piece) => setPieceInfo(piece)}
          onMoveDrawn={(next) => {
            if (
              isGameInMovePhaseWithPartialOrPreparingSubmission(next.gameState)
            ) {
              setMyMoves(next.gameState[props.color].moves);
            }
          }}
        />
        <br />
        {myMoves?.map((m) => (
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
