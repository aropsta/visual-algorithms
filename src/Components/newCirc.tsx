import * as d3 from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import Algorithms from "../lib/Algorithms";
import React from "react";
let array = [234, 23, 126, 90, 121, 434, 23, 19, 159, 233];
// const array = Algorithms(9);
bubbleSort();

const barHeight = 50;
const width = 500;
const scaleFactor = 2;
const textScale = 0.5;
const gap = 1;

function bubbleSort() {
  for (let j = 0; j < array.length; j++) {
    let swapped = false; //optimization: check if a swap operation has occured, if not, then value is in its correct place and can exit inner loop
    for (let i = 0; i < array.length - 1 - j; i++) {
      if (array[i] > array[i + 1]) {
        const temp = array[i];
        array[i] = array[i + 1];
        array[i + 1] = temp;
        swapped = true;
      }
    }
    //optimization to check if a swap operation has been occured. Otherwise arrway is already sorted, so we can exit
    if (!swapped) break;
  }
}
export default function NewCirc() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const section = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={section}>
      <svg
        // viewBox={`0 0 ${100} ${200}`}
        preserveAspectRatio={"xMidYMid meet"}
        ref={svgRef}
        height={barHeight * array.length}
      >
        {array.map((item, index) => {
          return (
            <g
              key={index}
              transform={`translate(0,${((barHeight * array.length) / array.length) * index})`}
            >
              <rect width={item * scaleFactor} height={barHeight - gap}></rect>
              <text
                fill="white"
                transform={`translate(${0},${0})`}
                fontSize={`${(barHeight * array.length) / 30}px`}
                x={scaleFactor * item}
                y={barHeight / 2}
              >
                {item}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
