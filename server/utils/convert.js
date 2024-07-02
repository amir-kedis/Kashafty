const jsonToArray = (json) => {
  const arr = [];
  for (const key in json) {
    arr.push(json[key]);
  }
  return arr;
};

const arrayToJson = (arr) => {
  const json = {};
  for (const key in arr) {
    json[key] = arr[key];
  }
  return json;
};

export { jsonToArray, arrayToJson };
