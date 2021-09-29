/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions
import { graphValues } from "./values.js";

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

const drawGraph = (size, columns, width) => {
  const column100 = Math.max(...columns);
  columns.forEach((column, index) => {
    const columnDiv = document.createElement("div");
    setTimeout(() => { columnDiv.style.height = `${(column / column100) * size}px`; }, 1);
    if (index === 4) {
      columnDiv.style.width = `${((graphValues.max - width[index]) / graphValues.max) * 100}%`;
    } else columnDiv.style.width = `${((width[index + 1] - width[index]) / graphValues.max) * 100}%`;
    container.appendChild(columnDiv);
  });
};

let checkTimeout;

const drawResult = async () => {
  /* const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://8hgzzytibb.execute-api.eu-central-1.amazonaws.com/soupatko", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send(Number(slider.noUiSlider.get())); */
  const result = await fetch("https://8hgzzytibb.execute-api.eu-central-1.amazonaws.com/soupatko", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Number(slider.noUiSlider.get())),
  });

  result.json().then((e) => {
    console.log(e);
    const correctAnswer = e.value;
    const columns = e.histo.vals;
    const width = e.histo.brks;
    console.log(correctAnswer);

    const correct = Number(slider.noUiSlider.get()) === correctAnswer;
    const sortedHandles = (correct ? [correctAnswer] : [correctAnswer, Number(slider.noUiSlider.get())])
      .sort((a, b) => a - b);
    const correctHandleIndex = sortedHandles.findIndex((value) => value === correctAnswer);
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
    drawGraph(height, columns, width);
  });
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
