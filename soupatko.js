/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions
import { graphValues, countColumns } from "./values.js";

const slider = document.getElementById("slider");
const selectedValue = document.getElementById("selectedValue");
const origins = slider.getElementsByClassName("noUi-origin");

const sliderOptions = {
  start: [(graphValues.max + graphValues.min) / 2],
  step: 1,
  tooltips: [true],
  range: {
    min: graphValues.min,
    max: graphValues.max,
  },
  format: wNumb({ decimals: 0 }),
  keyboardSupport: true,
};

noUiSlider.create(slider, sliderOptions);

let checkTimeout;

const drawResult = () => {
  const sortedHandles = [graphValues.correctResult, Number(slider.noUiSlider.get())].sort((a, b) => a - b);
  const correctHandleIndex = sortedHandles.findIndex((value) => value === graphValues.correctResult);
  const newOptions = {
    ...sliderOptions,
    start: sortedHandles,
    tooltips: [true, true],
  };
  slider.noUiSlider.destroy();
  noUiSlider.create(slider, newOptions);
  slider.setAttribute("disabled", true);
  origins[correctHandleIndex].classList.add("correctAnswer");
};

slider.noUiSlider.on("change", (values, handle) => {
  selectedValue.innerHTML = values[handle];
  clearTimeout(checkTimeout);
  checkTimeout = setTimeout(drawResult, 1000);
});
