type JsonObject = Record<string, any>;

const jsonToArray = (json: JsonObject): any[] => {
  const arr: any[] = [];
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      arr.push(json[key]);
    }
  }
  return arr;
};

const arrayToJson = (arr: any[]): JsonObject => {
  const json: JsonObject = {};
  arr.forEach((value, index) => {
    json[index] = value;
  });
  return json;
};

export { jsonToArray, arrayToJson };
