/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions
import { graphValues, answers, answersGraph } from "./values.js";

const height = 300;

const soupatko = (idcko, minimum, maximum, decimal, interval, correctAnswer) => {
  const slider = document.getElementById("slider");
  const origins = slider.getElementsByClassName("noUi-origin");
  const tooltips = slider.getElementsByClassName("noUi-tooltip");
  const container = document.getElementById("graphContainer");
  container.style.height = `${height}px`;

  const sliderOptions = {
    start: [(maximum + minimum) / 2],
    step: interval,
    tooltips: [true],
    range: {
      min: minimum,
      max: maximum,
    },
    pips: {
      mode: "count",
      values: 2,
      density: 100,
      stepped: true,
    },
    format: wNumb({ decimals: decimal }),
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
    const result = await fetch("https://8hgzzytibb.execute-api.eu-central-1.amazonaws.com/soupatko", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ val: slider.noUiSlider.get(), id: idcko }),
    });

    result.json().then((e) => {
      console.log(e);
      /*       const correctAnswer = e.value; */
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
};

/* ============================================================================== */

const klikatko = (correctAnswer) => {
  const radio = document.getElementById("radioContainer");

  const renderRadioGraph = () => {
    const column100 = Math.max(...answersGraph);
    let i = 0;
    document.querySelectorAll(".horizontalColumn").forEach((column) => {
      console.log(answersGraph[i], `${(answersGraph[i] / column100) * 100}%`);
      column.style.width = `${(answersGraph[i] / column100) * 100}%`;
      column.classList.add("horizontalColumnVisible");
      i += 1;
    });
    /* const column = document.createElement("div");
      column.classList.add("horizontalColumn");
      radioGraph.appendChild(column); */
  };

  const renderRadio = () => {
    radio.innerHTML = "";
    answers.forEach((answer) => {
      const node = document.createElement("div");
      node.classList.add("optionsContainer");

      const label = document.createElement("label");

      const dot = document.createElement("input");
      dot.type = "radio";
      dot.name = "radio";
      dot.value = answer;
      dot.id = answer;
      dot.addEventListener("click", (e) => {
        answers.forEach((option) => {
          document.getElementById(option).disabled = true;
          if (option === correctAnswer) {
            document.getElementById(option).classList.add("correctOption");
          }
        });
        /* console.log(e.target.value); */
        setTimeout(renderRadioGraph(), 1000);
      });
      node.appendChild(dot);

      label.htmlFor = answer;
      const option = document.createTextNode(answer);
      label.classList.add("labelContainer");
      label.appendChild(option);

      node.appendChild(label);

      const columnContainer = document.createElement("div");
      columnContainer.classList.add("columnContainer");
      const column = document.createElement("div");
      column.classList.add("horizontalColumn");
      columnContainer.appendChild(column);
      node.appendChild(columnContainer);

      radio.appendChild(node);
    });
  };
  renderRadio();
};

/* ============================================================================== */

soupatko("prdel", 0, 100, 1, 0.5, 69);
klikatko("Laa laa");
