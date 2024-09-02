import React, { useEffect, useRef, useState } from "react";
import genObj, { Bar, COLORS, bubbleSort } from "../lib/Algorithms";
import { randomValue } from "../lib/utils";
import * as d3 from "d3";

//size of our SVG chart
export enum chartDimens {
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
  const minSize = 10;
  const [sliderValue, setSliderValue] = useState(minSize);

  //conditional variable to dynamically set transitions/animations for d3 graph
  const newElement = useRef(false);

  //rate of animation in ms and also used to time transition animations
  const speedRef = useRef(300);
  //value of speed slider
  const [rate, setRate] = useState(300);

  //our data
  const [data, setData] = useState<Bar[]>(genObj(minSize));

  //reference to *generator function. Used to progress it
  const progRef = useRef<Generator<Bar[]> | null>(null);

  //reference to track running of requestAnimationFrame() function
  const animRef = useRef<number | null>();
  const prevTime = useRef(0);

  useEffect(() => {
    const svgSelection = d3.select(svgRef.current);
    const domainMax = d3.max(data.map((item) => item.value));

    //Scale the domain of the data into a given range available for displaying it
    //https://d3js.org/d3-scale/linear
    let yScale = d3
      .scaleLinear()
      .domain([0, domainMax!])
      .range([chartDimens.paddingBlock, chartDimens.innerHeight])
      .nice();

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

    //y-axis unused
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
      //For more information about d3 data joins:
      //https://d3js.org/d3-selection/joining
      const initialBarData = svgSelection
        .append("g")
        .attr("class", "group")
        .selectAll("rect")
        .data(data)
        .enter()

        //For each datum, create a rectangle along with attributes for it
        .append("rect")
        .attr("fill", (d) => d.color)
        .attr("y", (d) => chartDimens.outerHeight)
        .attr("height", (d) => 0 - chartDimens.paddingBlock)
        .attr("width", xScale.bandwidth())
        .attr("x", (_, i) => xScale(i.toString())!);

      //tooltip to show values on hover
      initialBarData
        .append("title")
        .attr("fill", "black")
        .text((d) => d.value.toString());

      initialBarData
        .transition()
        .duration(500)
        .ease(d3.easeElastic)
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
      .transition()
      .attr("y", (d) => chartDimens.innerHeight + chartDimens.paddingBlock)
      .attr("height", (d: any, i) => 0)
      .remove();

    //Update
    //Recalculating attributes for bars since data has been changed.

    //Conditionally set animation transitions if update is caused from a new element being added or not. Prevents the transitions from conflicting
    if (newElement) {
      barData
        .attr("fill", (d) => d.color)
        .transition()
        .duration(speedRef.current / 2)
        .delay(speedRef.current / 2)
        .attr("width", xScale.bandwidth())
        .attr("x", (d, i) => xScale(d.toIndex?.toString() ?? i.toString())!)
        .attr("height", (d) => yScale(d.value))
        .attr(
          "y",
          (d, i) =>
            chartDimens.paddingBlock +
            chartDimens.innerHeight -
            yScale(d.value),
        );
      newElement.current = false;
    } else {
      barData
        .attr("fill", (d) => d.color)
        .attr("x", (d, i) => xScale(d.fromIndex?.toString() ?? i.toString())!)

        .attr("height", (d) => yScale(d.value))
        .attr(
          "y",
          (d, i) =>
            chartDimens.paddingBlock +
            chartDimens.innerHeight -
            yScale(d.value),
        )
        .transition()
        .duration(speedRef.current)
        .attr("width", xScale.bandwidth())
        .attr("x", (d, i) => xScale(d.toIndex?.toString() ?? i.toString())!);
    }

    //Add
    //Append new a rectangle for data that is orphaned.
    //enter() returns the selection for data which exists but not displayed.
    barData
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d.fromIndex?.toString() ?? i.toString())!)
      .attr("y", (d) => chartDimens.innerHeight + chartDimens.paddingBlock)
      .attr("height", (d) => 0)
      .attr("width", xScale.bandwidth())
      .transition()
      .duration(speedRef.current / 2)
      .delay(speedRef.current / 2)
      .ease(d3.easeElastic.period(0.99))
      .attr("y", (d) => chartDimens.outerHeight)
      .attr("height", (d) => 0 - chartDimens.paddingBlock)
      .attr("fill", (d) => d.color)
      .attr("height", (d) => yScale(d.value))
      .attr(
        "y",
        (d, i) =>
          chartDimens.paddingBlock + chartDimens.innerHeight - yScale(d.value),
      );
    // Recalculate Axis
    svgSelection!.select<SVGSVGElement>(".x-axis").call(xAxis);
  }, [data]);

  function handleSize(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setSliderValue(value);
    newElement.current = false;
  }
  function handleSpeed(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    speedRef.current = value;
    setRate(speedRef.current);
  }

  //Syncronization between sliderValue and size of data array
  useEffect(() => {
    //add a bar
    if (sliderValue > data.length) {
      newElement.current = true;

      setData((currentData) => [
        ...currentData,
        {
          value: randomValue(0, 100),
          id: currentData.length + 1,
          color: COLORS.CONTROL,
          type: "none",
        },
      ]);
    }
    //remove a bar
    else if (sliderValue < data.length) {
      newElement.current = true;
      setData((prev) => [...prev.slice(0, sliderValue)]);
    }
  }, [sliderValue, data]);

  function resetColors() {
    data.forEach((item) => {
      item.color = COLORS.CONTROL;
      setData([...data]);
    });
  }

  //begin the sorting algorithm
  function onSort() {
    //reset colours if button is clicked.
    resetColors();

    //logic to pause/start generator function
    if (animRef.current) animRef.current = null;
    else {
      //begin generator function and assign it a ref
      progRef.current = bubbleSort(data);
      //begin generator animation/cadence of the function
      animRef.current = requestAnimationFrame(stepFunction);
    }
  }

  function tempSort() {}

  //Used to progress the *gen function at a constant rate
  function stepFunction(time: number) {
    let interval = time - prevTime.current;

    //if time interval has passed, return to/call gen Function
    if (interval > speedRef.current) {
      //assign to variable the yielded values from gen function
      const { value, done } = progRef.current!.next();
      prevTime.current = time;

      //once done, cancel animations and set its reference to null (so that it can be restarted again) otherwise set the data to whatever was yielded
      //
      if (done) {
        cancelAnimationFrame(animRef.current!);
        animRef.current = null;
      } else setData(value);
    }

    // continue animation so long as reference is not null. requestAnimationFrame would run at device refresh rate
    if (animRef.current) {
      animRef.current = requestAnimationFrame(stepFunction);
    }
  }

  return (
    <section>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartDimens.outerWidth} ${chartDimens.outerHeight}`}
      ></svg>
      {/* <button onClick={addData}>add</button> */}
      <button onClick={onSort}>sort</button>
      {/* <button onClick={decrement}>remove</button> */}
      {/* <button onClick={sort}>sort</button> */}
      <label htmlFor="input">Data Size: {sliderValue}</label>
      <br />
      {/* TODO: disable inputs when algo is running */}
      <input
        list="markers"
        id="input"
        min={minSize}
        max={50}
        type="range"
        value={sliderValue}
        step={1}
        onChange={handleSize}
      ></input>
      <label htmlFor="input">Speed: {rate}</label>
      <br />
      {/* TODO: disable inputs when algo is running */}
      <input
        list="markers"
        id="input2"
        min={10}
        max={2010}
        type="range"
        value={rate}
        step={50}
        onChange={handleSpeed}
      ></input>
    </section>
  );
}
