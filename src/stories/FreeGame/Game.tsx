import React, { useState } from 'react';
import { PieceState } from '../../gameMechanics/Piece/types';
import { PieceInfo } from '../../mahaDosGame/components/PieceInfo';
import { Maha, MahaProps } from '../../mahaDosGame/components/Maha';
import { Color } from '../../gameMechanics/commonTypes';

type Props = {
  color: Color;
  onSubmitMoves: MahaProps['onSubmitMoves'];
  onSubmitAttacks: MahaProps['onSubmitAttacks'];
  gameState: MahaProps['gameState'];
};


export const MahaGame: React.FC<Props> = (props) => {
  const [pieceInfo, setPieceInfo] = useState<PieceState>();
  // const [preparingMoves, setMyMoves] = useState<Move[]>();
  // const [myAttacks, setMyAttacks] = useState<Attack[]>();

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
          onSubmitAttacks={props.onSubmitAttacks}
          playingColor={props.color}
          onPieceTouched={(piece) => setPieceInfo(piece)}
          onSquareTouched={() => setPieceInfo(undefined)}
        />
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
