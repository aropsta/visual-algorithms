import { Selection, select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import * as d3 from "d3";

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

//Append a group to the selection. Design pattern for easily resizing/transforming our graph
export function createGroup(
  selection: null | Selection<SVGSVGElement | null, unknown, null, undefined>,
) {
  selection!
    .append("rect")
    .attr("width", chartDimens.outerWidth)
    .attr("height", chartDimens.outerHeight)
    .attr("fill", "aqua");
}
