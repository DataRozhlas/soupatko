/* global noUiSlider, wNumb */
import { correctResult, tips } from "./values.js";

const slider = document.getElementById("slider");
const selectedValue = document.getElementById("selectedValue");
const origins = slider.getElementsByClassName("noUi-origin");

const sliderOptions = {
  start: [100],
  step: 1,
  tooltips: [true],
  range: {
    min: 0,
    max: 200,
  },
  format: wNumb({ decimals: 0 }),
  pips: {
    mode: "positions",
    values: [0, 25, 50, 75, 100],
    density: 4,
  },
  keyboardSupport: true,
};

noUiSlider.create(slider, sliderOptions);

let checkTimeout;

const drawResult = () => {
  const newOptions = {
    ...sliderOptions,
    start: [correctResult, Number(slider.noUiSlider.get())].sort((a, b) => a - b),
    tooltips: [true, true],
  };
  slider.noUiSlider.destroy();
  noUiSlider.create(slider, newOptions);
  slider.setAttribute("disabled", true);
  origins[0].classList.add("correctAnswer");
};

slider.noUiSlider.on("change", (values, handle) => {
  selectedValue.innerHTML = values[handle];
  clearTimeout(checkTimeout);
  checkTimeout = setTimeout(drawResult, 1000);
});
