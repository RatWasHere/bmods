module.exports = {
  data: {
    name: "Custom Data Top",
  },
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
        element: "input",
        name: "Database",
        storeAs: "database",
    },
    "-",
    {
      element: "input",
      name: "Data Name",
      storeAs: "dataName",
      placeholder: "Enter the name of the data field",
    },
    "-",
    {
      element: "dropdown",
      name: "Result Type",
      storeAs: "resultType",
      choices: [
        { name: "All Results", value: "all results" },
        { name: "Top N Results", value: "top n results" },
        { name: "Bottom N Results", value: "bottom n results" },
        { name: "Range", value: "range" },
      ],
    },
    "_",
    {
      element: "inputGroup",
      nameSchemes: ["Start", "End"],
      storeAs: ["rangeStart", "rangeEnd"],
      placeholder: ["Start index (Lists Start At 0)", "End index"],
    },
    "_",
    {
      element: "dropdown",
      name: "Sort Order",
      storeAs: "sortOrder",
      choices: [
        { name: "Descending", value: "Descending" },
        { name: "Ascending", value: "Ascending" },
      ],
    },
    "_",
    {
      element: "input",
      name: "Result Format",
      storeAs: "resultFormat",
      placeholder: "Example: ID: ${id} - Data: ${DataValue}",
    },
    "_",
    {
      element: "storage",
      storeAs: "store",
      name: "Store List As",
    },
  ],
  subtitle: (values, constants) => {
    return `Database: ${values.database} - Data Name: ${
      values.dataName
    } - Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let fs = bridge.fs;
    const filePath = bridge.file(values.database);
    let data = fs.readFileSync(filePath, 'utf8');
    let jsonObject = JSON.parse(data);
    let dataList = [];

    for (let Id in jsonObject) {
    let Value = jsonObject[Id][bridge.transf(values.dataName)];
    if (Value !== undefined) {
    dataList.push({Id: Id, Value: Value});
}
}

if (dataList.length === 0) return;

dataList.sort((a, b) => {
    const aValue = parseInt(a.Value, 10);
    const bValue = parseInt(b.Value, 10);
    return values.sortOrder === "Ascending"
      ? aValue - bValue
      : bValue - aValue;
  });

let filteredDataList;
const resultType = values.resultType.toLowerCase();
switch (resultType) {
  case "top n results":
    const topN = Number(bridge.transf(values.rangeStart));
    if (topN > 0) filteredDataList = dataList.slice(0, topN);
    break;
  case "bottom n results":
    const bottomN = Number(bridge.transf(values.rangeEnd));
    if (bottomN > 0) filteredDataList = dataList.slice(-bottomN);
    break;
  case "range":
    const rangeStart = Number(bridge.transf(values.rangeStart));
    const rangeEnd = Number(bridge.transf(values.rangeEnd));
    filteredDataList = dataList.slice(rangeStart, rangeEnd);

    break;
  case "all results":
    filteredDataList = dataList;
    break;
}

if (filteredDataList) {
    const formattedResult = filteredDataList
      .map((item) => {
        return values.resultFormat
          .replace("${id}", item.Id)
          .replace("${DataValue}", item.Value);
      })
      .join(",");

    bridge.store(values.store, bridge.transf(formattedResult).split(","));
};
}
};
