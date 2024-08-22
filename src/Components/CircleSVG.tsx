import * as React from "react";
import { SVGProps } from "react";
// let cx = 160;
// let cy = 160;
let diameter = 160 * 2;
let stroke = 10;
let radius = 160 - stroke / 2;
console.log("RADIUS: " + radius);
let circumf = 2 * Math.PI * radius;
const CircleSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={diameter}
    height={diameter}
    viewBox={`0 0 ${diameter} ${diameter} `}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      id="Circle"
      cx={diameter / 2}
      cy={diameter / 2}
      r={radius}
      stroke="white"
      strokeWidth={stroke}
      strokeDasharray={circumf}
      strokeDashoffset={(circumf / 360) * 90}
    />
  </svg>
);
export default CircleSVG;
