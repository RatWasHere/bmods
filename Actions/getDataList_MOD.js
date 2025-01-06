module.exports = {
  data: {
    name: "Get Data List",
  },
  category: "Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "dropdown",
      name: "Data Type",
      storeAs: "dataType",
      extraField: "serverId",
      choices: [
        { name: "Users" },
        { name: "Members", field: true, placeholder: "Enter server ID here" },
        { name: "Channels" },
        { name: "Servers" },
        { name: "Globals" },
      ],
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
    "-",
    {
      element: "dropdown",
      name: "Informations by ID",
      storeAs: "positionValue",
      extraField: "positionId",
      choices: [
        { name: "None", value: "" },
        { name: "ID", field: true, placeholder: "Enter ID here" },
      ],
    },
    "_",
    {
      element: "storage",
      storeAs: "storePosition",
      name: "Store Position As (Positions Start At 0)",
    },
    "_",
    {
      element: "storage",
      storeAs: "storeDataValue",
      name: "Store Data Value As",
    },
  ],
  subtitle: (values, constants) => {
    return `Data Type: ${values.dataType} - Data Name: ${
      values.dataName
    } - Store As: ${constants.variable(values.store)}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let dataType = values.dataType.toLowerCase();

    if (dataType === "servers") dataType = "guilds";
    if (dataType === "globals") dataType = "lists";

    if (!storedData || !storedData[dataType]) return;

    let dataList = [];
    if (dataType === "lists") {
      for (const key in storedData[dataType]) {
        dataList.push({
          id: key,
          data: storedData[dataType][key],
          name: "Unknown",
        });
      }
    } else {
      for (const id in storedData[dataType]) {
        const dataEntry = storedData[dataType][id];
        if (dataEntry && dataEntry[values.dataName] !== undefined) {
          dataList.push({
            id,
            data: dataEntry[values.dataName],
            name: "Unknown",
          });
        }
      }
    }

    if (dataList.length === 0) return;

    dataList.sort((a, b) => {
      const aValue = parseInt(a.data, 10);
      const bValue = parseInt(b.data, 10);
      return values.sortOrder === "Ascending"
        ? aValue - bValue
        : bValue - aValue;
    });

    const positionId = bridge.transf(values.positionId);
    const serverId = bridge.transf(values.serverId);
    const serverIdLength = serverId ? serverId.length : 0;

    if (dataType === "members" && serverId) {
      dataList.forEach((item) => {
        if (item.id.startsWith(serverId)) {
          item.id = item.id.slice(serverIdLength);
        }
      });
    }

    let positionIndex = -1;
    let positionValue = null;
    if (positionId) {
      positionIndex = dataList.findIndex((item) => item.id === positionId);
      if (positionIndex !== -1) {
        positionValue = dataList[positionIndex].data;
      }
    }

    let filteredDataList;
    const resultType = values.resultType.toLowerCase();
    switch (resultType) {
      case "top n results":
        const topN = parseInt(values.rangeStart, 10);
        if (topN > 0) filteredDataList = dataList.slice(0, topN);
        break;
      case "bottom n results":
        const bottomN = parseInt(values.rangeEnd, 10);
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
            .replace("${id}", item.id)
            .replace("${DataValue}", item.data);
        })
        .join(",");

      bridge.store(values.store, bridge.transf(formattedResult).split(","));

      if (positionIndex !== -1) {
        bridge.store(values.storePosition, positionIndex);
        bridge.store(values.storeDataValue, positionValue);
      }
    }
  },
};
