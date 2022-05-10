import React, { CSSProperties, MouseEvent, useCallback, useMemo } from 'react';
import { BoardState } from '../gameMechanics/Board/types';
import { IdentifiablePieceState } from '../gameMechanics/Piece/types';
import {
  Coord,
  flipMatrixIndexHorizontally,
  matrixGet,
  MatrixIndex,
  matrixIndexToCoord,
  matrixReduce,
  noop
} from '../gameMechanics/util';
import { SVGOverlay, Arrow } from './SVGOverlay';
import { Color } from '../gameMechanics/commonTypes';
import { TerrainPiece } from './TerrainPiece';

export type ChessTerrainProps = {
  sizePx: number;
  board: BoardState;
  pieceAssets: Record<string, string>;

  playingColor: Color;
  arrows?: Arrow[];
  styledCoords?: (Coord & { style?: CSSProperties })[];
  overlays?: { coord: Coord; component: React.ReactNode }[];

  orientation?: Color;

  // This is always on TouchPiece
  onPieceTouched?: (
    piece: IdentifiablePieceState<string>,
    coord: Coord
  ) => void;
  onEmptySquareTouched?: (coord: Coord) => void;

  // Called both on onPieceTouched or onEmptySquareTouched
  onCoordTouched?: (coord: Coord) => void;
};

const coordToArrow = (squareSize: number, val: number) =>
  val * squareSize + squareSize / 2;

export const ChessTerrain: React.FC<ChessTerrainProps> = ({
  pieceAssets,
  onPieceTouched = noop,
  onEmptySquareTouched = noop,
  onCoordTouched = noop,

  playingColor,
  orientation = playingColor,
  board,
  sizePx,
  arrows = [],
  styledCoords = [],
  overlays = []
}) => {
  // This is super important in order to not reorder the pieces,
  //  thus breaking any animation!
  // TODO: Look into optimizing it even more!
  const pieceCoordsAndIdSortedById = useMemo(() => {
    return matrixReduce(
      board.pieceLayoutState,
      (accum, next, index) => {
        if (next === 0) {
          return accum;
        }

        return [
          ...accum,
          {
            id: next.id,
            coord: matrixIndexToCoord(index)
          }
        ];
      },
      [] as { id: string; coord: Coord }[]
    ).sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }

      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });
  }, [board.pieceLayoutState]);

  const squareSize = useMemo(
    () => sizePx / board.terrainState.length,
    [sizePx, board.terrainState.length]
  );

  const isFlipped = useMemo(() => orientation !== 'white', [orientation]);

  const onBoardClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      const rect = (e.target as any).getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const y = e.clientY - rect.top; //y position within the element.

      const absoluteCoords = {
        row: Math.floor(y / squareSize),
        col: Math.floor(x / squareSize)
      };

      const absoluteMatrixIndex: MatrixIndex = [
        absoluteCoords.row,
        absoluteCoords.col
      ];

      const workingMatrixIndex = isFlipped
        ? flipMatrixIndexHorizontally(
            board.pieceLayoutState,
            absoluteMatrixIndex
          )
        : absoluteMatrixIndex;

      const workingCoords = {
        row: workingMatrixIndex[0],
        col: workingMatrixIndex[1]
      };

      const piece = matrixGet(board.pieceLayoutState, workingMatrixIndex);

      if (piece) {
        onPieceTouched(piece, workingCoords);
      } else {
        onEmptySquareTouched(workingCoords);
      }

      onCoordTouched(workingCoords);
    },
    [
      isFlipped,
      squareSize,
      board,
      playingColor,
      onCoordTouched,
      onEmptySquareTouched,
      onPieceTouched
    ]
  );

  return (
    <div
      className="chess-terrain--container"
      style={{
        width: sizePx,
        height: sizePx,
        backgroundImage: 'url("tiles_dark.png")',
        backgroundRepeat: 'repeat',
        backgroundSize: (sizePx * 2) / board.terrainState.length,
        position: 'relative',
        zIndex: 99,
        ...(isFlipped && {
          transform: 'scaleY(-1)'
        })
        // Adjust the position if needed to match the bottomLeft corner
        // backgroundPosition: `0 ${props.sizePx * 2}`,
      }}
    >
      <SVGOverlay
        // fill="purple"
        width={sizePx}
        height={sizePx}
        arrows={arrows.map((arrow) => ({
          ...arrow,
          from: {
            x: coordToArrow(squareSize, arrow.from.y),
            y: coordToArrow(squareSize, arrow.from.x)
          },
          to: {
            x: coordToArrow(squareSize, arrow.to.y),
            y: coordToArrow(squareSize, arrow.to.x)
          }
        }))}
      />
      {styledCoords.map(({ style, ...coord }) => (
        <div
          style={{
            ...style,
            position: 'absolute',
            width: squareSize,
            height: squareSize,
            left: coord.col * squareSize,
            top: coord.row * squareSize
          }}
        />
      ))}
      {pieceCoordsAndIdSortedById.map(({ coord }) => {
        const piece = (board.pieceLayoutState[coord.row] || [])[coord.col];

        if (!piece) {
          return null;
        }

        return (
          <TerrainPiece
            piece={piece}
            squareSize={squareSize}
            coord={coord}
            assetsMap={pieceAssets}
            style={{
              ...(isFlipped && {
                transform: 'scaleY(-1)'
              })
            }}
          />
        );
      })}
      {overlays.map(({ coord, component }) => (
        <div
          style={{
            position: 'absolute',
            width: squareSize,
            height: squareSize,
            left: coord.col * squareSize,
            top: coord.row * squareSize,
            zIndex: 9999
          }}
        >
          {component}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          zIndex: 9998
        }}
        onClick={onBoardClick}
      />
    </div>
  );
};
