import React, { useLayoutEffect, useRef, useState } from "react";

import generateData, { bubbleSort } from "../logic/Algorithms";
import { Selection, select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import * as d3 from "d3";

export default function Graph() {
  const data = generateData(100);
  bubbleSort(data);
  const svgRef = useRef<SVGSVGElement>(null);

  //https://d3js.org/d3-array/summarize#max
  const maxValue = d3.max(data);
  const minValue = 0;

  //size of our SVG element
  const minHeight = 0;
  const height = 200;

  const minWidth = 0;
  const width = 500;

  //Scale data the domain of the data into a given range
  const scaleY = scaleLinear()
    .domain([minValue, maxValue!])
    .range([minHeight, height]);

  //Band scales divide the domain of input data into uniform bands, then maps those to the range available in our display view
  const scaleX = scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([minWidth, width])
    .align(0.5)
    .paddingInner(0.13)
    .paddingOuter(0.05)
    .round(true);

  const [svgSelection, selectSVG] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  function createBars(
    svgSelection: Selection<SVGSVGElement | null, unknown, null, undefined>,
  ) {}

  useLayoutEffect(() => {
    // Further details about d3 selections: https://bost.ocks.org/mike/join/
    // if statement to statisfy Typescript
    if (svgSelection == null) {
      // Define d3 svg selection using the reference to an element from the DOM
      selectSVG(d3.select(svgRef.current));
    } else {
      createBars(svgSelection);
    }
  }, [svgSelection]);

  return (
    <section>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}></svg>
    </section>
  );
}
