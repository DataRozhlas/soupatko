/* eslint-disable no-plusplus */
const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const createRandomNumberArray = (elementCount, min, max) => {
  const randomNumbers = [];
  for (let i = 0; i < elementCount; i++) {
    randomNumbers.push(getRandomIntInclusive(min, max));
  }
  return randomNumbers;
};

export const graphValues = {
  result: 35,
  min: 0,
  max: 50,
  numOfColumns: 10,
  correctResult: 7,
};

const randomNumbers = createRandomNumberArray(1000, graphValues.min, graphValues.max);

const counter = {};
randomNumbers.forEach((num) => {
  if (counter[num]) counter[num] += 1;
  else counter[num] = 1;
});

export const getColumns = (numOfColumns, min, max) => {
  const interval = (max - min) / numOfColumns;
  const arr = Array(numOfColumns).fill(0);
  Object.entries(counter).forEach(([value, count]) => {
    for (let i = 0; i < numOfColumns; i++) {
      if (value >= (interval * i) && value < (interval * (i + 1))) {
        arr[i] += count;
      }
      if (value === max) arr[numOfColumns - 1] += count;
    }
  });
  return arr;
};
