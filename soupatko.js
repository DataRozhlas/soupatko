/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* global noUiSlider, wNumb */
// eslint-disable-next-line import/extensions

const height = 70;

export const soupatko = (idcko, title, minimum, maximum, buckets, decimal, interval, correctAnswer) => {
  const soupatkoContainer = document.getElementById(idcko);
  soupatkoContainer.classList.add("soupatkoContainer");

  soupatkoContainer.innerHTML = "";

  const node = document.createElement("div");

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("questionContainer");
  const question = document.createTextNode(title);
  questionContainer.appendChild(question);
  node.appendChild(questionContainer);

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("descriptionContainer");
  node.appendChild(descriptionContainer);

  const soupejteContainer = document.createElement("div");
  soupejteContainer.classList.add("soupejteContainer");
  const soupejte = document.createTextNode("← vyberte váš tip →");
  soupejteContainer.appendChild(soupejte);
  node.appendChild(soupejteContainer);

  const container = document.createElement("div");
  container.id = "graphContainer";
  container.classList.add("graphContainer");
  node.appendChild(container);

  const slider = document.createElement("div");
  slider.id = "slider";
  slider.classList.add("slider");
  node.appendChild(slider);

  const range = document.createElement("div");
  range.classList.add("range");
  const minContainer = document.createElement("div");
  const min = document.createTextNode(minimum);
  minContainer.appendChild(min);
  const maxContainer = document.createElement("div");
  const max = document.createTextNode(maximum);
  maxContainer.appendChild(max);
  range.appendChild(minContainer);
  range.appendChild(maxContainer);
  node.appendChild(range);

  soupatkoContainer.appendChild(node);

  const sliderOptions = {
    start: [(maximum + minimum) / 2],
    step: interval,
    tooltips: [true],
    range: {
      min: minimum,
      max: maximum,
    },
    format: wNumb({ decimals: decimal }),
    keyboardSupport: true,
  };

  noUiSlider.create(slider, sliderOptions);

  const origins = slider.getElementsByClassName("noUi-origin");
  const tooltips = slider.getElementsByClassName("noUi-tooltip");

  const drawGraph = (height, vals, brks, minimum, maximum, buckets) => {
    // binning
    const binSize = (maximum - minimum) / (buckets - 1);
    const binCount = new Array(buckets).fill(0);
    brks.forEach((brk, i) => {
      binCount[Math.round((brk - minimum) / binSize)] += vals[i];
    });

    const column100 = Math.max(...binCount);

    binCount.forEach((column) => {
      const columnDiv = document.createElement("div");
      setTimeout(() => {
        columnDiv.style.height = `${(column / column100) * height}px`;
        columnDiv.style.background = "#E5E5E5";
        descriptionContainer.innerHTML = "Jak tipovali ostatní čtenáři";
      }, 1000);
      columnDiv.style.width = "100%";
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

      const tagContainer = document.createElement("div");
      tagContainer.classList.add("tagContainer");
      const correctTag = document.createTextNode("správná odpověď");
      tagContainer.appendChild(correctTag);
      tooltips[correctHandleIndex].appendChild(tagContainer);

      drawGraph(height, e.histo.vals, e.histo.brks, minimum, maximum, buckets);
    });
  };

  slider.noUiSlider.on("set", () => {
    checkTimeout = setTimeout(drawResult, 300);
  });

  slider.noUiSlider.on("slide", () => {
    soupejteContainer.innerHTML = "";
    clearTimeout(checkTimeout);
  });
};

/*

export const klikatko = (correctAnswer) => {
  const radio = document.getElementById("radioContainer");

  const renderRadioGraph = () => {
    const column100 = Math.max(...answersGraph);
    let i = 0;
    document.querySelectorAll(".horizontalColumn").forEach((column) => {
      column.style.width = `${(answersGraph[i] / column100) * 100}%`;
      column.classList.add("horizontalColumnVisible");
      i += 1;
    });
  };

  const renderRadio = () => {
    radio.innerHTML = "";
    answers.forEach((answer) => {
      const node = document.createElement("div");
      node.classList.add("optionsContainer");

      const dotTextContainer = document.createElement("div");
      dotTextContainer.classList.add("dotTextContainer");

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

        setTimeout(renderRadioGraph(), 300);
      });
      dotTextContainer.appendChild(dot);

      const label = document.createElement("label");
      label.htmlFor = answer;
      const option = document.createTextNode(answer);
      label.classList.add("labelContainer");
      label.appendChild(option);

      dotTextContainer.appendChild(label);
      node.appendChild(dotTextContainer);

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

*/
