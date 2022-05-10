import React, { CSSProperties, useMemo } from 'react';
import { getRefFromPieceId } from '../gameMechanics/Board/util';
import { IdentifiablePieceState } from '../gameMechanics/Piece/types';
import { Coord } from '../gameMechanics/util';

type Props = {
  piece: IdentifiablePieceState;
  assetsMap: Record<string, string>;
  squareSize: number;
  coord: Coord;
  style?: CSSProperties;
};

export const TerrainPiece: React.FC<Props> = ({
  piece,
  assetsMap,
  squareSize,
  coord,
  style
}) => {
  const asset = useMemo(
    () => assetsMap[getRefFromPieceId(piece.id).ref],
    [piece.id, assetsMap]
  );

  return (
    <div
      key={piece.id}
      id={piece.id}
      style={{
        position: 'absolute',
        color: piece.color,
        width: squareSize,
        height: squareSize,
        left: coord.col * squareSize,
        top: coord.row * squareSize,
        zIndex: 9,

        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',

        transition: 'all 150ms linear',

        ...style,
      }}
    >
      <img src={asset} alt={piece.label} style={{ width: squareSize / 1.4 }} />
      <div
        style={{
          width: '90%'
        }}
      >
        <div
          style={{
            width: `${(piece.hitPoints / piece.maxHitPoints) * 100}%`,
            height: '2px',
            background: 'red'
          }}
        />
      </div>
    </div>
  );
};
