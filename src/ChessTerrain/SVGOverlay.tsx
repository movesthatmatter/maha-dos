import React, { CSSProperties } from 'react';
import { LineVector } from '../gameMechanics/util';

const DEFAULT_ARROW_STROKE_COLOR = 'purple';

export type Arrow = LineVector & {
  strokeColor?: string;
};

type Props = {
  width: number;
  height: number;
  fill?: string;
  // className
  style?: CSSProperties;

  arrows?: Arrow[];
};

export const SVGOverlay: React.FC<Props> = ({
  width,
  height,
  fill,
  arrows,
  // className,
  style
}) => {
  return (
    <div
      style={{
        width,
        height,
        zIndex: 99999,
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={style}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {arrows?.map(({ from, to, strokeColor }, i) => (
          <>
            <defs>
              <marker
                id={`arrowhead-${i}`}
                markerWidth={4}
                markerHeight={4}
                refX={1}
                refY={2}
                orient="auto"
              >
                <polygon
                  points="0 4, 3 2, 0 0"
                  fill={strokeColor || DEFAULT_ARROW_STROKE_COLOR}
                />
              </marker>
            </defs>
            <line
              strokeWidth={10}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={strokeColor || DEFAULT_ARROW_STROKE_COLOR}
              markerEnd={`url(#arrowhead-${i})`}
            />
          </>
        ))}
      </svg>
    </div>
  );
};
