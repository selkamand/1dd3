import * as d3 from "d3";
import { getColumnTypes } from "./utils";

export const easy1d = () => {
  //! Properties
  //? Read/Write
  let data;
  let id;
  let interPlotBuffer = 10; // Number of pixels between the plots
  let tickSize = 0;
  let tickSizeOuter = 0;
  let tickPadding = 0;
  let positionTopLeft = [50, 50]; //Top left position (based on top left of y Axis line)
  let positionBottomRight = [800, 700]; //bottom right position (based on bottom right of x axis line)
  let fontSizeX = 12;
  let fontSizeY = 12;
  let mouseOverFunction = null; // Functions fired on events
  let mouseMoveFunction = null; // Functions fired on events
  let mouseLeaveFunction = null; // Functions fired on events
  let hideAxisX = true;
  let xPadding = 0.05;

  let xScale = null; // Allow premade xScale to be supplied

  // let rectSecondaryClass = ""; // Secondary classes

  //! Chart Rendering Function
  const my = function (selection) {
    //! Assertions
    if (data === undefined || data === null)
      throw new Error("data is a required argument and must be defined");
    if (id === undefined || id === null)
      throw new Error("id is a required argument and must be defined");

    const xAccessor = (d) => d[id];
    const arrIDs = data.map(xAccessor);

    //! Parse column types
    const columnNamesAndTypes = getColumnTypes(data, id); // Object with 1 property per column with value 'categorical' or 'quantitative' (excluding the id column)
    const columnTypes = columnNamesAndTypes.map((d) => d.type);
    const columnNames = columnNamesAndTypes.map((d) => d.name);

    //! Create xScale (If user hasn't supplied their own
    if (xScale === null) {
      xScale = d3
        .scaleBand()
        .domain(arrIDs)
        .range([positionTopLeft[0], positionBottomRight[0]])
        .padding(xPadding);
    }

    //! Layout Maths
    const yStartPosition = positionTopLeft[1];
    const totalPlotHeight = positionBottomRight[1] - positionTopLeft[1];
    const numberOfPlots = columnNames.length;
    const numberOfQuantitativePlots = Object.values(columnTypes).filter(
      (d) => d === "quantitative"
    ).length;
    const numberOfCategoricalPlots = numberOfPlots - numberOfQuantitativePlots;

    const nonBufferHeight =
      totalPlotHeight - interPlotBuffer * (numberOfPlots - 1);

    const perPlotHeightCategorical =
      nonBufferHeight /
      (numberOfQuantitativePlots * 2 + numberOfCategoricalPlots);

    const perPlotHeightQuantitative = perPlotHeightCategorical * 2;

    //! Create array of length numberOfPlots which contains all the info required for plotting
    const plotInfo = [];
    let currentStartPos = yStartPosition;
    columnNames.map((column, index) => {
      const coltype = columnTypes[index];
      let colScale = null;
      // let tooltip = null;
      const colname = column;
      const values = data.map((d) => d[colname]); // Array of values for column
      const plotHeight =
        coltype === "quantitative"
          ? perPlotHeightQuantitative
          : perPlotHeightCategorical;
      const startPosY =
        currentStartPos + interPlotBuffer * (index == 0 ? 0 : 1);
      const endPosY = startPosY + plotHeight;

      const plotObjects = {
        name: colname,
        colScale: colScale,
        startPosY: startPosY,
        endPosY: endPosY,
        centerPosY: startPosY + plotHeight / 2,
        values: values,
      };

      currentStartPos = endPosY;

      // Scales
      if (coltype === "quantitative") {
        plotObjects["domain"] = d3.extent(data.map((d) => d[column]));

        plotObjects["yScale"] = d3
          .scaleLinear()
          .domain(plotObjects["domain"])
          .range([plotObjects["endPosY"], plotObjects["startPosY"]])
          .nice();

        plotObjects["yAxis"] = d3
          .axisLeft(plotObjects["yScale"])
          .tickSizeOuter(0);

        plotObjects["marks"] = values.map((v, indexData) => ({
          x: arrIDs[indexData],
          y: v,
          xPixel: xScale(arrIDs[indexData]),
          yPixel: plotObjects["yScale"](v),
          width: xScale.bandwidth(),
          height: plotObjects["endPosY"] - plotObjects["yScale"](v),
        }));
      } else if (coltype === "categorical") {
        plotObjects["domain"] = [0];

        plotObjects["yScale"] = d3
          .scaleBand()
          .domain(plotObjects["domain"])
          .range([plotObjects["endPosY"], plotObjects["startPosY"]]);

        plotObjects["yAxis"] = d3
          .axisLeft(plotObjects["yScale"])
          .tickValues([]); // Remove ticks and text

        plotObjects["marks"] = values.map((v, indexData) => ({
          x: arrIDs[indexData],
          y: "1rowtile",
          xPixel: xScale(arrIDs[indexData]),
          yPixel: plotObjects["startPosY"],
          width: xScale.bandwidth(),
          height: plotObjects["yScale"].bandwidth(),
        }));
      }

      plotInfo.push(plotObjects);
    });

    console.table(plotInfo);

    // y Scales already created above

    //! Create Parent Group
    const chartGroup = selection
      .selectAll(".easy1d")
      .data([null])
      .join("g")
      .attr("class", "easy1d");

    //! Draw Data
    plotInfo.map((colData, index) => {
      const charts = chartGroup
        .selectAll(".easy1d-rects-" + index)
        .data(colData.marks)
        .join("rect")
        .attr("class", ".easy1d-rects-" + index)
        .attr("fill", "black")
        .attr("x", (d) => d.xPixel)
        .attr("y", (d) => d.yPixel)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height);
    });

    //! Create Axes
    // Y Axis
    plotInfo.map((d, index) => {
      const yAxis = d.yAxis;
      // console.log(d.yAxis)
      const yAxisGroup = chartGroup
        .selectAll(".y-axis-" + index)
        .data([null])
        .join("g")
        .attr("class", "y-axis-" + index)
        .attr("transform", `translate(${positionTopLeft[0]},0)`);

      yAxis(yAxisGroup);

      // Add titles

      const title = chartGroup
        .append("text")
        .attr("class", "y-axis-title-" + index)
        .attr("text-anchor", "end")
        .attr("x", positionTopLeft[0] - 10) // Adjust the x coordinate for positioning
        .attr("y", d.centerPosY) // Position in the center of the Y axis
        // .attr("dy", "0.35em")
        // .attr("transform", `translate(-50, ${d.centerPosY}) rotate(-90)`)
        .text(d.name);

      // yAxisGroup
      //   .selectAll(".y-axis-title-" + index)
      //   .data([null])
      //   .join("text")
      //   .attr("class", "y-axis-title-" + index)
      //   .attr("text-anchor", "end")
      //   // .attr("y", centerPosY)
      //   .text(d.name);
    });

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    //! Render Axes
    // chartGroup
    //   .selectAll(".y-axis")
    //   .data([null])
    //   .join("g")
    //   .attr("class", "y-axis")
    //   .attr("transform", `translate(${positionTopLeft[0]}, 0)`)
    //   .call(yAxis);

    if (!hideAxisX) {
      const xAxisContainer = chartGroup
        .selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${positionBottomRight[1]})`)
        .call(xAxis);

      // xAxisContainer
      //   .selectAll(".tick text")
      //   .attr("transform", "rotate(90)")
      //   .style("text-anchor", "start");
    }

    //! Enforce Axis Label Fontsize
    chartGroup
      .selectAll(".y-axis>.tick>text")
      .style("font-size", fontSizeY + "px");
    chartGroup
      .selectAll(".x-axis>.tick>text")
      .style("font-size", fontSizeX + "px");

    // debugger;
  };

  //! Get-Sets
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.tickSize = function (_) {
    return arguments.length ? ((tickSize = _), my) : tickSize;
  };

  my.tickSizeOuter = function (_) {
    return arguments.length ? ((tickSizeOuter = _), my) : tickSizeOuter;
  };

  my.tickPadding = function (_) {
    return arguments.length ? ((tickPadding = _), my) : tickPadding;
  };

  my.positionTopLeft = function (_) {
    return arguments.length ? ((positionTopLeft = _), my) : positionTopLeft;
  };

  my.positionBottomRight = function (_) {
    return arguments.length
      ? ((positionBottomRight = _), my)
      : positionBottomRight;
  };

  my.interPlotBuffer = function (_) {
    return arguments.length ? ((interPlotBuffer = _), my) : interPlotBuffer;
  };

  my.fontSizeX = function (_) {
    return arguments.length ? ((fontSizeX = _), my) : fontSizeX;
  };

  my.fontSizeY = function (_) {
    return arguments.length ? ((fontSizeY = _), my) : fontSizeY;
  };

  my.mouseOverFunction = function (_) {
    return arguments.length ? ((mouseOverFunction = _), my) : mouseOverFunction;
  };

  my.mouseMoveFunction = function (_) {
    return arguments.length ? ((mouseMoveFunction = _), my) : mouseMoveFunction;
  };

  my.mouseLeaveFunction = function (_) {
    return arguments.length
      ? ((mouseLeaveFunction = _), my)
      : mouseLeaveFunction;
  };

  my.id = function (_) {
    return arguments.length ? ((id = _), my) : id;
  };

  //! Axis visibility switches
  // Axes
  my.hideAxisX = function () {
    hideAxisX = true;
    return my;
  };

  my.showAxisX = function () {
    hideAxisX = false;
    return my;
  };

  // my.hideAxisY = function () {
  //   hideAxisY = true;
  //   return my;
  // };

  // my.showAxisY = function () {
  //   hideAxisY = false;
  //   return my;
  // };

  my.xScale = function (_) {
    return arguments.length ? ((xScale = _), my) : xScale;
  };

  return my;
};
