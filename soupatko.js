/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions
import { graphValues, getColumns, answers } from "./values.js";

const height = 300;

const slider = document.getElementById("slider");
const origins = slider.getElementsByClassName("noUi-origin");
const tooltips = slider.getElementsByClassName("noUi-tooltip");
const container = document.getElementById("graphContainer");
const radio = document.getElementById("inputRadio");
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

const drawGraph = (size) => {
  const columnArray = getColumns(graphValues.numOfColumns, graphValues.min, graphValues.max);
  const column100 = Math.max(...columnArray);
  columnArray.forEach((column) => {
    const columnDiv = document.createElement("div");
    setTimeout(() => { columnDiv.style.height = `${(column / column100) * size}px`; }, 1);
    columnDiv.style.width = `${100 / graphValues.numOfColumns}%`;
    container.appendChild(columnDiv);
  });
};

let checkTimeout;

const drawResult = () => {
  console.log(Number(slider.noUiSlider.get()));
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://8hgzzytibb.execute-api.eu-central-1.amazonaws.com/soupatko", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send(Number(slider.noUiSlider.get()));

  const correct = Number(slider.noUiSlider.get()) === graphValues.correctResult;
  const sortedHandles = (correct ? [graphValues.correctResult] : [graphValues.correctResult, Number(slider.noUiSlider.get())])
    .sort((a, b) => a - b);
  const correctHandleIndex = sortedHandles.findIndex((value) => value === graphValues.correctResult);
  const disabledHandleIndex = sortedHandles.findIndex((value) => value === Number(slider.noUiSlider.get()));
  const newOptions = {
    ...sliderOptions,
    start: sortedHandles,
    tooltips: correct ? [true] : [true, true],
  };
  slider.noUiSlider.destroy();
  noUiSlider.create(slider, newOptions);
  slider.setAttribute("disabled", true);
  if (correct) {
    origins[disabledHandleIndex].classList.add("correctAnswer");
  } else origins[disabledHandleIndex].classList.add("disabledHandle");
  tooltips[disabledHandleIndex].classList.add("disabledTooltip");
  origins[correctHandleIndex].classList.add("correctAnswer");
  tooltips[correctHandleIndex].classList.add("correctTooltip");
  drawGraph(height);
};

slider.noUiSlider.on("set", () => {
  checkTimeout = setTimeout(drawResult, 1000);
});

slider.noUiSlider.on("slide", () => {
  clearTimeout(checkTimeout);
});

/* const drawRadio = () => {
  radio.innerHTML = "";
  answers.forEach((answer, index) => {
    const node = document.createElement("div");

    const option = document.createElement("input");
    option.type = "radio";

    const label = document.createElement("label");
    radio.appendChild(option);

    label.appendChild(option);
  });
};

drawRadio();
 */
