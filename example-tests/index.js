// Imports
import * as d3 from "d3";
import { easy1d, getColumnTypes } from "easy-1d";

// Data
//prettier-ignore
const data = [
  { patientID: "Patient1", categoricalAnnotation1: "Annotation A", categoricalAnnotation2: "Annotation X", numericAnnotation: 3.5 },
  { patientID: "Patient2", categoricalAnnotation1: "Annotation B", categoricalAnnotation2: "Annotation Y", numericAnnotation: 2.1 },
  { patientID: "Patient3", categoricalAnnotation1: "Annotation A", categoricalAnnotation2: "Annotation Z", numericAnnotation: 4.7 },
  { patientID: "Patient4", categoricalAnnotation1: "Annotation C", categoricalAnnotation2: "Annotation W", numericAnnotation: 1.9 },
  { patientID: "Patient5", categoricalAnnotation1: "Annotation B", categoricalAnnotation2: "Annotation V", numericAnnotation: 6.3 },
  { patientID: "Patient6", categoricalAnnotation1: "Annotation D", categoricalAnnotation2: "Annotation U", numericAnnotation: 2.8 },
  { patientID: "Patient7", categoricalAnnotation1: "Annotation A", categoricalAnnotation2: "Annotation T", numericAnnotation: 5.2 },
  { patientID: "Patient8", categoricalAnnotation1: "Annotation E", categoricalAnnotation2: "Annotation S", numericAnnotation: 3.0 },
  { patientID: "Patient9", categoricalAnnotation1: "Annotation D", categoricalAnnotation2: "Annotation R", numericAnnotation: 7.1 },
];

// Get Window Dimensions
const width = window.innerWidth;
const height = window.innerHeight;

const margin = { top: 40, right: 40, bottom: 60, left: 200 };

// Create SVG
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const chartBuilder = easy1d()
  .data(data)
  .id("patientID")
  .showAxisX()
  .positionTopLeft([margin.left, margin.top])
  .positionBottomRight([width - margin.right, height - margin.bottom]);
// positionBottomRight(width, height);

console.log(getColumnTypes(data));

chartBuilder(svg);
