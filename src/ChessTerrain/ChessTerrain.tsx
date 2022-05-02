import React, {
  CSSProperties,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { BoardState } from '../gameMechanics/Board/types';
import { boardMap } from '../gameMechanics/Board/util';
import { Move } from '../gameMechanics/Game/types';
import { IdentifiablePieceState } from '../gameMechanics/Piece/types';
import { Coord, noop } from '../gameMechanics/util';
import Arrow from './ArrowSVG';

// type SquareCoord = Coord;

type ArrowChessCoords = {
  from: Coord;
  to: Coord;
};

export type ChessTerrainProps = {
  sizePx: number;
  board: BoardState;

  arrows?: ArrowChessCoords[];
  styledCoords?: (Coord & { style?: CSSProperties })[];

  // This is always on TouchPiece
  onTouchedPiece?: (
    piece: IdentifiablePieceState<string>,
    coord: Coord
  ) => void;
  onMove?: (move: Move) => void;
};

// const coordToArrow = ()
const coordToArrow = (squareSize: number, val: number) =>
  val * squareSize + squareSize / 2;

export const ChessTerrain: React.FC<ChessTerrainProps> = ({
  onTouchedPiece = noop,
  onMove = noop,
  board,
  sizePx,
  arrows = [],
  styledCoords = []
}) => {
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
      onTouchedPiece(touchedPiece.piece, touchedPiece.coord);
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

      // console.log('actual', { x, y }, 'coord', coord);

      if (touchedPiece) {
        onMove({
          from: touchedPiece.coord,
          to: coord,
          piece: touchedPiece.piece
        });
        setTouchedPiece(undefined);
      }
    },
    [squareSize, touchedPiece]
  );

  // const onPieceClick = useCallback((e: MouseEvent) => {

  // }, [squareSize])

  return (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        background: 'green',
        backgroundImage: 'url("tiles_dark.png")',
        backgroundSize: (sizePx * 2) / board.terrainState.length,
        backgroundRepeat: 'repeat',

        position: 'relative',
        zIndex: 99
        // Adjust the position if needed to match the bottomLeft corner
        // backgroundPosition: `0 ${props.sizePx * 2}`,
      }}
    >
      <Arrow
        fill="purple"
        width={sizePx}
        height={sizePx}
        arrows={arrows.map(({ from, to }) => ({
          from: {
            x: coordToArrow(squareSize, from.col),
            y: coordToArrow(squareSize, from.row)
          },
          to: {
            x: coordToArrow(squareSize, to.col),
            y: coordToArrow(squareSize, to.row)
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
      {boardMap(board, (coord, piece) => {
        // TODO: Optimize by only iterating over the pieces!
        if (!piece) {
          return null;
        }

        return (
          <div
            style={{
              position: 'absolute',
              // background: 'rgba(255, 0, 0, .2)',
              color: piece.color,
              width: squareSize,
              height: squareSize,
              left: coord.col * squareSize,
              top: coord.row * squareSize,
              zIndex: 9,

              display: 'flex',
              // flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer'
              // alignSelf: 'center',
            }}
            onClick={(e) => {
              setTouchedPiece({
                coord,
                piece
              });

              e.stopPropagation();
            }}
            // onClick={() => {
            //   // setTouchedPiece()
            //   onTouch(coord, piece);
            // }}
            // onMouseDown={(e) => {
            //   e.preventDefault();

            //   console.log('works', e);
            // }}
          >
            {piece.label}
            <br />
            {(piece.hitPoints / piece.maxHitPoints) * 100} HP
          </div>
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
          cursor: 'pointer'
        }}
        onClick={onBoardClick}
      />
    </div>
  );
};
