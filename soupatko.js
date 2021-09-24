/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions
import { graphValues, getColumns } from "./values.js";

const height = 300;

const slider = document.getElementById("slider");
const selectedValue = document.getElementById("selectedValue");
const origins = slider.getElementsByClassName("noUi-origin");
const container = document.getElementById("graphContainer");
container.style.height = `${height}px`;

const sliderOptions = {
  start: [(graphValues.max + graphValues.min) / 2],
  step: 1,
  tooltips: [true],
  range: {
    min: graphValues.min,
    max: graphValues.max,
  },
  pips: {
    mode: "count",
    values: 2,
    density: 100,
    stepped: true,
  },
  format: wNumb({ decimals: 0 }),
  keyboardSupport: true,
};

noUiSlider.create(slider, sliderOptions);

const drawGraph = (height) => {
  const columnArray = getColumns(graphValues.numOfColumns, graphValues.min, graphValues.max);
  const column100 = Math.max(...columnArray);
  columnArray.forEach((column) => {
    const columnDiv = document.createElement("div");
    columnDiv.style.height = `${(column / column100) * height}px`;
    columnDiv.style.width = `${100 / graphValues.numOfColumns}%`;
    container.appendChild(columnDiv);
  });
};

let checkTimeout;

const drawResult = () => {
  const correct = Number(slider.noUiSlider.get()) === graphValues.correctResult;
  const sortedHandles = (correct ? [graphValues.correctResult] : [graphValues.correctResult, Number(slider.noUiSlider.get())])
    .sort((a, b) => a - b);
  const correctHandleIndex = sortedHandles.findIndex((value) => value === graphValues.correctResult);
  const newOptions = {
    ...sliderOptions,
    start: sortedHandles,
    tooltips: correct ? [true] : [true, true],
  };
  slider.noUiSlider.destroy();
  noUiSlider.create(slider, newOptions);
  slider.setAttribute("disabled", true);
  origins[correctHandleIndex].classList.add("correctAnswer");
  drawGraph(height);
};

slider.noUiSlider.on("change", (values, handle) => {
  selectedValue.innerHTML = values[handle];
  clearTimeout(checkTimeout);
  checkTimeout = setTimeout(drawResult, 1000);
});
