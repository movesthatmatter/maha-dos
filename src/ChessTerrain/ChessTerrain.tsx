import React, {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  toPrintableBoard
} from '../gameMechanics/Board/util';
import { BoardState } from '../gameMechanics/Board/types';
import { IdentifiablePieceState } from '../gameMechanics/Piece/types';
import {
  Coord,
  matrixGet,
  matrixIndexToCoord,
  matrixReduce,
  noop
} from '../gameMechanics/util';
import { SVGOverlay, Arrow } from './SVGOverlay';
import { Color, Move } from '../gameMechanics/commonTypes';
import { TerrainPiece } from './TerrainPiece';

// type ArrowChessCoords = {
//   from: Coord;
//   to: Coord;
//   color?: string;
// };

export type ChessTerrainProps = {
  sizePx: number;
  board: BoardState;
  pieceAssets: Record<string, string>;

  playingColor: Color;
  arrows?: Arrow[];
  styledCoords?: (Coord & { style?: CSSProperties })[];

  // This is always on TouchPiece
  onPieceTouched?: (
    piece: IdentifiablePieceState<string>,
    coord: Coord
  ) => void;
  onPieceDestinationSet?: (move: Move) => void;

  // TODO: Implement
  onSquareTouched?: (coord: Coord) => void;
};

// const coordToArrow = ()
const coordToArrow = (squareSize: number, val: number) =>
  val * squareSize + squareSize / 2;

export const ChessTerrain: React.FC<ChessTerrainProps> = ({
  pieceAssets,
  onPieceTouched = noop,
  onPieceDestinationSet = noop,
  onSquareTouched = noop,
  playingColor,
  board,
  sizePx,
  arrows = [],
  styledCoords = []
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

  useEffect(() => {
    console.log('ChessTerrain updated pieceLayoutState');
    console.log(toPrintableBoard(board));
  }, [board.pieceLayoutState]);

  const squareSize = useMemo(
    () => sizePx / board.terrainState.length,
    [sizePx, board.terrainState.length]
  );

  const [touchedPiece, setTouchedPiece] =
    useState<{
      coord: Coord;
      piece: IdentifiablePieceState<string>;
    }>();

  useEffect(() => {
    if (touchedPiece) {
      onPieceTouched(touchedPiece.piece, touchedPiece.coord);
    }
  }, [touchedPiece]);

  const onBoardClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      const rect = (e.target as any).getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const y = e.clientY - rect.top; //y position within the element.

      const coord = {
        row: Math.floor(y / squareSize),
        col: Math.floor(x / squareSize)
      };

      const piece = matrixGet(board.pieceLayoutState, [coord.row, coord.col]);

      console.log('touched coord', coord, piece === 0 ? undefined : piece?.id);
      console.log(toPrintableBoard(board));

      if (touchedPiece && touchedPiece.piece.color === playingColor) {
        onPieceDestinationSet({
          from: touchedPiece.coord,
          to: coord,
          piece: touchedPiece.piece
        });

        setTouchedPiece(undefined);
        return;
      }

      if (piece && piece.id !== touchedPiece?.piece.id) {
        setTouchedPiece({
          coord,
          piece
        });

        return;
      }

      onSquareTouched(coord);
      setTouchedPiece(undefined);
    },
    [
      onPieceDestinationSet,
      onSquareTouched,
      squareSize,
      touchedPiece,
      board,
      playingColor
    ]
  );

  // const pieceRef = useMemo(() => refFromPieceId(), []);

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
        zIndex: 99
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
          />
          // <div
          //   key={piece.id}
          //   id={piece.id}
          //   style={{
          //     position: 'absolute',
          //     color: piece.color,
          //     width: squareSize,
          //     height: squareSize,
          //     left: coord.col * squareSize,
          //     top: coord.row * squareSize,
          //     zIndex: 9,

          //     display: 'flex',
          //     flexDirection: 'column',
          //     alignContent: 'center',
          //     alignItems: 'center',
          //     textAlign: 'center',
          //     cursor: 'pointer',

          //     transition: 'all 150ms linear'
          //   }}
          // >
          //   {/* <img
          //     src={pieceAssets[getRefFromPieceId(piece.id).ref]}
          //     alt={piece.label}
          //     style={{ width: squareSize/1.2 }}
          //   /> */}
          //   {/* {getRefFromPieceId(piece.id).ref} */}
          //   {/* {piece.label} */}
          //   {(piece.hitPoints / piece.maxHitPoints) * 100} HP
          // </div>
        );
      })}
      <div
        style={{
          background: 'rgba(255, 0, 0, .1)',
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          zIndex: 9999
        }}
        onClick={onBoardClick}
      />
    </div>
  );
};
