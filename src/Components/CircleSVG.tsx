import * as React from "react";
//import { SVGProps } from "react";
let diameter = 160 * 2;
let stroke = 50;
let radius = 160 - stroke / 2;
let array = [5, 10, 20, 40];
let angles = [] as number[];
let sum = 0;
let angle = 0;
let circumf = 2 * Math.PI * radius;

array.forEach((item) => {
  sum += item;
});
array.forEach((item) => {
  angles.push(angle);
  angle += (item / sum) * 360;
});
export default function CircleSVG(props: Array<Number>) {
  //{props.map((item, index) =>{})}
  //asd

  console.log("angles: " + angles);

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter} `}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {array.map((item, i) => {
        return (
          <circle
            key={i}
            id="Circle"
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={`hsl(${Math.floor(Math.random() * 255)}, 100%, 59%)`}
            strokeWidth={stroke}
            strokeDasharray={circumf}
            strokeDashoffset={(circumf * item) / sum - 60}
            transform={`rotate(${angles[i]}, 160, 160)`}
          />
        );
      })}
      )
    </svg>
  );
}
