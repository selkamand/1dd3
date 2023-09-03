# easy-1d

Effortlessly visualize all features in a dataset with 1dd3's vertically aligned plots and automatic plot selection based on variable type. Plots are fully interactive, and custom tooltips can be added.

**Why 1 dimensional plots?**

When trying to understand trends in your data, it’s often helpful to plot multiple 2D plots. However, there are many applications it’s extremely useful to densely stack visual representations of each property in your dataset on top of one another, regardless of data type. By unifying the x axis across each plot, gg1d allows you to turn a series of 1D plots into an n-dimensional visualization where n = number of columns in your data frame. This can be a very useful tool for various applications, and in my case was developed to annotate oncoplots with clinical metadata.

Note the key to utility in this endeavour is to ‘preserve the individual.’ We don’t plot distributions of properties, we plot each value of a feature for each subject in the dataset.

## Installation

`npm install easy-1d`

## Quick Start

```{javascript}
// Define input data (First column will become the X axis, all other columns will be plotted)
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


const chartBuilder = easy1d()
  .data(data)
  .id('patientID')

```
