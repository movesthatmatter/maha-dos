import React, { useState } from 'react';
import { PieceState } from '../../gameMechanics/Piece/types';
import { PieceInfo } from '../../mahaDosGame/components/PieceInfo';
import {
  isGameInMovePhaseWithPartialOrPreparingSubmission,
  Move
} from '../../gameMechanics/Game/types';
import { Maha, MahaProps } from '../../mahaDosGame/components/Maha';
import { Color } from '../../gameMechanics/util';
import { moveToMahaChessMove } from '../../mahaDosGame/util';

type Props = {
  color: Color;
  onSubmitMoves: MahaProps['onSubmitMoves'];
  gameState: MahaProps['gameState'];
};

export const MahaGame: React.FC<Props> = (props) => {
  const [pieceInfo, setPieceInfo] = useState<PieceState>();
  const [myMoves, setMyMoves] = useState<Move[]>();

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div>
        <Maha
          gameState={props.gameState}
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
              setMyMoves((prev) => [...(prev || []), next.move]);
            }
          }}
        />
        <br />
        {myMoves?.map((m) => (
          <span>{`${m.piece.label}:${moveToMahaChessMove(m)?.from}-${
            moveToMahaChessMove(m)?.to
          }, `}</span>
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
        <h6>
          {props.gameState?.state === 'inProgress' && props.gameState.phase}
        </h6>
        <br />
        {pieceInfo && <PieceInfo piece={pieceInfo} />}
      </div>
    </div>
  );
};

export const Primary = MahaGame.bind({});
