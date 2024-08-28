import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import genObj, {
  randomValue,
  Bar,
  state,
  bubbleSort,
} from "../logic/Algorithms";
import * as d3 from "d3";
import { shuffle } from "d3";

//size of our SVG chart
export const enum chartDimens {
  paddingBlock = 16,
  paddingInline = 5,

  outerWidth = 300,
  outerHeight = 210,

  minWidth = 0,
  minHeight = 0,

  innerHeight = outerHeight - 2 * paddingBlock,
  innerWidth = outerWidth - 2 * paddingInline,
}

export default function Graph() {
  //Svg DOM reference and d3.select variables
  const svgRef = useRef<SVGSVGElement>(null);

  //The data array and size that is dynamically set by a slider
  const [sliderValue, setSliderValue] = useState(10);
  const [data, setData] = useState<Bar[]>(genObj(10));

  function useArray(array: Bar[]) {
    return useMemo(() => [...array], [array]);
  }

  useEffect(() => {
    console.log("useEffect()");
    const svgSelection = d3.select(svgRef.current);
    const trans = d3.transition().duration(500).ease(d3.easeCubicIn);
    const trans2 = d3.transition().ease(d3.easeCubicIn);

    const domainMax = d3.max(data.map((item) => item.value));

    //Scale the domain of the data into a given range available for displaying it
    //https://d3js.org/d3-scale/linear
    let yScale = d3
      .scaleLinear()
      .domain([0, domainMax!])
      .range([chartDimens.paddingBlock, chartDimens.innerHeight]);

    //Band scales divide the domain of the data into uniform bands, then maps those to the range available to display it
    //https://d3js.org/d3-scale/band
    let xScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i.toString()))
      .range([chartDimens.paddingInline, chartDimens.innerWidth])
      .align(0.5)
      .paddingInner(0.12)
      .round(true);

    //defining our x and y axis
    //https://d3js.org/d3-axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickSizeInner(3)
      .tickFormat((d, i) => (i % 1 === 0 ? i.toString() : ""));
    // const yAxis = d3.axisBottom(yScale);

    //Define our joined data+elements
    const barData = svgSelection.select(".group").selectAll("rect").data(data);

    // If there is no group/graph, create a new one
    if (svgSelection.select(".group").empty()) {
      // Appending a group for our x-axis to our selection, also positioning it at the same time
      svgSelection!
        .append("g")
        .attr("class", "x-axis")
        .attr(
          "transform",
          `translate(0, ${chartDimens.innerHeight + chartDimens.paddingBlock * 2})`,
        )
        // .transition(animateAxis)
        .attr(
          "transform",
          `translate(0, ${chartDimens.innerHeight + chartDimens.paddingBlock})`,
        )
        //call function draws the axis on the svg
        .call(xAxis);

      //y-axis unsed
      // const yAxisGroup = svgSelection
      //   .append("g")
      //   .attr("fill", "white")
      //   .attr("transform", `translate(${chartDimens.paddingBlock}, 0)`)
      //   .call(yAxis);

      //Begin by appending a group for better management of individual bars
      //'select' all proceeding rectangles and asscociate them with a given array of data.
      //For more information about d3 data joins: https://d3js.org/d3-selection/joining
      const initialBarData = svgSelection
        .append("g")
        .attr("class", "group")
        .selectAll("rect")
        .data(data)
        .enter();

      //For each datum, create a rectangle along with attributes for it
      initialBarData
        .append("rect")
        .attr("fill", (d) => d.color)
        .attr("y", (d) => chartDimens.outerHeight)
        .attr("height", (d) => 0 - chartDimens.paddingBlock)
        .attr("width", xScale.bandwidth())
        .attr("x", (_, i) => xScale(i.toString())!)
        .attr("scaleY", (d) => `${yScale(d.value)}`)
        .transition(trans)
        .attr("height", (d) => yScale(d.value))
        .attr(
          "y",
          (d) =>
            chartDimens.paddingBlock +
            chartDimens.innerHeight -
            yScale(d.value),
        );
      return;
    }

    //Remove
    //'exit()' returns or 'selects' elements which are currently rendered, but do not have corresponding data in the array. We remove these
    barData
      .exit()
      .transition(trans2)
      .attr("y", (d) => chartDimens.innerHeight)
      .attr("height", (d) => chartDimens.paddingBlock)
      .remove();

    console.log("UPDATE");
    //Update
    //Recalculating attributes for bars since data has been changed.
    barData
      .transition(trans2)
      .attr("height", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("scaleY", (d, i) => `${yScale(d.value)}`)
      .attr("x", (d, i) => xScale(i.toString())!)
      .attr(
        "y",
        (d, i) =>
          chartDimens.paddingBlock + chartDimens.innerHeight - yScale(d.value),
      );

    //Add
    //Append new rectangles for data that is orphaned.
    //enter() returns the selection for data which exists but not displayed.
    barData
      .enter()
      .append("rect")
      .attr("fill", (d) => d.color)
      .attr("x", (d, i) => xScale(i.toString())!)
      .attr("y", (d) => chartDimens.outerHeight)
      .attr("height", (d) => 0 - chartDimens.paddingBlock)
      .attr("width", xScale.bandwidth())
      .transition(trans2)
      .attr("height", (d) => yScale(d.value))
      .attr(
        "y",
        (d, i) =>
          chartDimens.paddingBlock + chartDimens.innerHeight - yScale(d.value),
      );

    // Recalculate Axis
    svgSelection!.select<SVGSVGElement>("g.x-axis").call(xAxis);
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setSliderValue(value);
  }

  //changes the length of data according to slider value
  const update = useCallback(() => {
    //add a bar
    if (sliderValue > data.length)
      setData((currentData) => [
        ...currentData,
        {
          value: randomValue(),
          state: state.ROOT,
          color: "white",
        },
      ]);
    //remove a bar
    else if (sliderValue < data.length) {
      setData((prev) => [...prev.slice(0, sliderValue)]);
    }
  }, [sliderValue, data]);

  //Syncronizing between sliderValue and size of data array
  useEffect(() => {
    // const debounceTimer = setTimeout(() => {
    update();
    // }, 10);
    // return () => clearTimeout(debounceTimer);
  }, [sliderValue, update]);

  function sort() {
    setData((prev) => bubbleSort(prev));
    update();
  }

  return (
    <section>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartDimens.outerWidth} ${chartDimens.outerHeight}`}
      ></svg>
      {/* <button onClick={addData}>add</button> */}
      <button onClick={sort}>sort</button>
      {/* <button onClick={decrement}>remove</button> */}
      {/* <button onClick={sort}>sort</button> */}
      <label htmlFor="input">Data Size</label>
      <br />
      <input
        list="markers"
        id="input"
        min={10}
        max={50}
        type="range"
        value={sliderValue}
        step={1}
        onChange={handleChange}
      ></input>
    </section>
  );
}
