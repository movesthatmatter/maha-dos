import React, { CSSProperties } from 'react';
import { formatDiagnostic } from 'typescript';

export type ArrowCoords = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
};

type Props = {
  width: number;
  height: number;
  fill?: string;
  // className
  style?: CSSProperties;

  arrows?: ArrowCoords[];
};

const Arrow: React.FC<Props> = ({
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
        background: 'rgba(0, 255, 0, .1)',
        width,
        height
      }}
    >
      {/* {JSON.stringify(from)}
      {JSON.stringify(to)} */}
      <svg
        // className={className}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={style}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {arrows?.map(({ from, to }) => (
          <>
            <defs>
              <marker
                id="arrowhead-g"
                orient="auto"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="0"
                // cgKey="g"
              >
                <path d="M0,0 V4 L3,2 Z" fill="red"></path>
              </marker>
            </defs>
            <line
              strokeWidth={10}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="black"
            />
          </>
        ))}

        {/* <line
          stroke="red"
          stroke-width={width}
          // stroke-linecap="round"
          // marker-end="url(#arrowhead-g)"
          opacity=".5"
          x1={width}
          y1={200}
          x2={width}
          // y2="0"
          // cgHash="419,419,g7,g5,green"
        ></line> */}
        {/* <path d="M16.1147 43.5H25.1147H34.1147V99H16.1147V43.5Z" fill="#C4C4C4"/>
      <path d="M25.1147 0L50.2295 43.5H0L25.1147 0Z" fill="#C4C4C4"/> */}
        {/* <path
        fill={fill}
        fillRule="evenodd"
        stroke="none"
        d="M5.98342301,8.62083755 L2.92113518,6.19075581 L2.92113518,6.19075581 C2.52475208,5.87620558 1.95586894,5.90732985 1.59616788,6.26324634 L0.959514871,6.89320083 L0.959514871,6.89320083 C0.594139673,7.25473175 0.562350154,7.83437344 0.885997743,8.23369271 L5.2466429,13.6138954 L5.2466429,13.6138954 C5.59439201,14.0429514 6.22411693,14.1088636 6.65317287,13.7611145 C6.69371383,13.7282561 6.73162055,13.6922747 6.76654568,13.6535 L17.0639568,2.22107107 L17.0639568,2.22107107 C17.4213804,1.82425092 17.4039137,1.21660822 17.0242859,0.840974635 L16.6411512,0.461871039 L16.6411512,0.461871039 C16.2672586,0.0919123331 15.6706798,0.0748389377 15.276241,0.422808882 L5.98342301,8.62083755 Z"
      /> */}
      </svg>
    </div>
  );
};

export default Arrow;

{
  /* <svg>
  <defs>
    <marker
      id="arrowhead-g"
      orient="auto"
      markerWidth="4"
      markerHeight="8"
      refX="2.05"
      refY="2.01"
      cgKey="g"
    >
      <path d="M0,0 V4 L3,2 Z" fill="#15781B"></path>
    </marker>
  </defs>
  <line
    stroke="#15781B"
    stroke-width="8.18359375"
    stroke-linecap="round"
    marker-end="url(#arrowhead-g)"
    opacity="1"
    x1="78.5625"
    y1="340.4375"
    x2="78.5625"
    y2="243.87109375"
    cgHash="419,419,g7,g5,green"
  ></line>
</svg>; */
}

{
  /* <path d="M16.1147 43.5H25.1147H34.1147V99H16.1147V43.5Z" fill="#C4C4C4"/>
<path d="M25.1147 0L50.2295 43.5H0L25.1147 0Z" fill="#C4C4C4"/> */
}
