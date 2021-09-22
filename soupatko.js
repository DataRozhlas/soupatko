/* eslint-disable quotes */
const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
output.innerHTML = slider.value;

const setValue = () => {
  console.log(document.getElementById("myRange").value);
  slider.disabled = true;
};

let checkTimeout;

slider.oninput = () => {
  clearTimeout(checkTimeout);
  checkTimeout = setTimeout(setValue, 1000);
};
