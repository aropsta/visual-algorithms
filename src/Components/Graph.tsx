import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import generateData, { bubbleSort, randomValue } from "../logic/Algorithms";
import { Selection, select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import * as d3 from "d3";

export default function Graph() {
  //Svg DOM reference and d3.select variables
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSelection, selectSVG] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  //The data array and size that is dynamically set by a slider
  const [dataSize, setDataSize] = useState(3);
  const [data, setData] = useState(generateData(dataSize));

  //d3 function to get the maximum value from a given array
  //more details https://d3js.org/d3-array/summarize#max
  const maxValue = d3.max(data);
  console.log("max: " + maxValue);
  const minValue = 0;
  const maxDataSize = 100;

  //size of our SVG chart
  const enum chartDimens {
    paddingBlock = 16,
    paddingInline = 5,
    outerHeight = 210,
    innerHeight = outerHeight - 2 * paddingBlock,

    minHeight = 0,

    outerWidth = 300,
    innerWidth = outerWidth - 2 * paddingInline,
    minWidth = 0,
  }

  //Scale the domain of the data into a given range available for displaying it
  let scaleY = scaleLinear()
    .domain([minValue, maxValue!])
    .range([chartDimens.paddingBlock, chartDimens.innerHeight]);

  //Band scales divide the domain of the data into uniform bands, then maps those to the range available to display it
  let scaleX = scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([chartDimens.paddingInline, chartDimens.innerWidth])
    .align(0.5)
    .paddingInner(0.13)
    .round(true);

  function setGraphScaling() {
    //Scale the domain of the data into a given range available for displaying it
    scaleY = scaleLinear()
      .domain([minValue, maxValue!])
      .range([chartDimens.paddingBlock, chartDimens.innerHeight]);

    //Band scales divide the domain of the data into uniform bands, then maps those to the range available to display it
    scaleX = scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([chartDimens.paddingInline, chartDimens.innerWidth])
      .align(0.5)
      .paddingInner(0.11)
      .round(true);
  }

  // generate our graph of bars and axis
  function createBars(
    svgSelection: Selection<SVGSVGElement | null, unknown, null, undefined>,
  ) {
    //------------------Creating the bars for our graph.-----------------------------//

    // Appending an x-axis to our selection, also positioning it at the same time
    // const xAxis = svgSelection
    //   .append("g")
    //   .attr(
    //     "transform",
    //     `translate(0, ${chartDimens.innerHeight + chartDimens.paddingBlock})`,
    //   )
    //   .attr("fill", "blue")
    //   //call function draws the axis on the svg
    //   .call(d3.axisBottom(scaleX));

    //y-axis unsed
    // const yAxisGroup = svgSelection
    //   .append("g")
    //   .attr("fill", "white")
    //   .attr("transform", `translate(${chartDimens.paddingBlock}, 0)`)
    //   .call(d3.axisLeft(scaleY));

    //For the proceeding rectangles, asscociate them with a given array of data.
    //enter() returns data that is orphaned without an element asscociated to it
    //More information about d3 data joins https://d3js.org/d3-selection/joining

    svgSelection
      .append("rect")
      .attr("width", chartDimens.outerWidth)
      .attr("height", chartDimens.outerHeight)
      .attr("fill", "aqua");
    const bars = svgSelection.append("g").selectAll("rect").data(data);
    // Above line also preappends a group before selecting rectangles for data. Makes it simpler to translate them all at once

    //For each datum, create a rectangle with attributes for it
    bars
      .enter()
      .append("rect")
      .attr("height", (d) => scaleY(d))
      .attr("width", scaleX.bandwidth())
      .attr("scaleY", (d, i) => `${scaleY(d)}`)
      .attr("x", (d, i) => scaleX(i.toString())!)
      .attr(
        "y",
        (d, i) =>
          chartDimens.paddingBlock + chartDimens.innerHeight - scaleY(d),
      )
      .attr("fill", "black");
  }
  function sort() {
    bubbleSort(data);
    if (svgSelection) {
      const selection = svgSelection.select("g").selectAll("rect").data(data);
      selection
        .attr("height", (d) => scaleY(d))
        .attr("width", scaleX.bandwidth())
        .attr("scaleY", (d, i) => `${scaleY(d)}`)
        .attr("x", (d, i) => scaleX(i.toString())!)
        .attr(
          "y",
          (d, i) =>
            chartDimens.paddingBlock + chartDimens.innerHeight - scaleY(d),
        );
    }
  }
  function increment() {
    const value = randomValue();
    setData([...data, value]);
    setGraphScaling();
  }
  function decrement() {
    if (data.length > 1) {
      const slicedData = data.slice(0, data.length - 1);
      setData(slicedData);
      setGraphScaling();
    }
  }

  function updateGraph() {
    //Null pointer check to satisfy typescript
    if (svgSelection) {
      //Define our joined data+elements
      const barData = svgSelection.select("g").selectAll("rect").data(data);

      //Remove
      //'exit()' returns or 'selects' elements which are currently rendered, but do not have corresponding data in the array. We remove these
      barData.exit().remove();

      //Update
      //Recalculating attributes for bars since data has been changed.
      barData
        .attr("height", (d) => scaleY(d))
        .attr("width", scaleX.bandwidth())
        .attr("scaleY", (d, i) => `${scaleY(d)}`)
        .attr("x", (d, i) => scaleX(i.toString())!)
        .attr(
          "y",
          (d, i) =>
            chartDimens.paddingBlock + chartDimens.innerHeight - scaleY(d),
        );

      //Add
      //Append new rectangles for data that is orphaned.
      //enter() returns the selection for data which exists but not displayed.
      barData
        .enter()
        .append("rect")
        .attr("height", (d) => scaleY(d))
        .attr("width", scaleX.bandwidth())
        .attr("scaleY", (d, i) => `${scaleY(d)}`)
        .attr("x", (d, i) => scaleX(i.toString())!)
        .attr(
          "y",
          (d, i) =>
            chartDimens.paddingBlock + chartDimens.innerHeight - scaleY(d),
        );
    }
  }

  // Looks for change in data
  useEffect(() => {
    updateGraph();
  }, [data]);

  useLayoutEffect(() => {
    // Further details about d3 selections: https://bost.ocks.org/mike/join/
    // if statement to statisfy Typescript
    if (!svgSelection) {
      // Define d3 svg selection using an element from the DOM
      selectSVG(d3.select(svgRef.current));
    } else {
      createBars(svgSelection);
    }
  }, [svgSelection]);

  return (
    <section>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartDimens.outerWidth} ${chartDimens.outerHeight}`}
      ></svg>
      <button onClick={increment}>add</button>
      <button onClick={decrement}>remove</button>
      <button onClick={sort}>sort</button>
    </section>
  );
}
