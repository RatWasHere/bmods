module.exports = {
  data: { name: "Load Multiple Global Data(s)" },
  category: "Global Data",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia"
  },
  UI: [
    {
        element: "input",
        storeAs: "label",
        name: "Label (optional)"
    },
    "-",
    {
      element: "input",
      storeAs: "defaultval",
      name: "Default Value",
    },
    "-",
    {
      element: "menu",
      storeAs: "retrievelist",
      name: "List of Global Data(s)",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes: {
        data: {
          data: {},
          name: "Data Name:",
          preview: "`${option.data.dataname}`",
          UI: [
            {
              element: "input",
              storeAs: "dataname",
              name: "Data Name",
            },
            {
              element: "store",
              storeAs: "store",
              name: "Store As"
            },
          ],
        },
      },
    },
  ],
  subtitle: (data, values) => {
    return `Label: ${data.label}, Retrieve ${data.retrievelist.length} global data(s).`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : "";

    for (let item of values.retrievelist) {
      let listData = defaultVal;

      const dataName = item.data.dataname;
      const storeLocation = item.data.store;

      try {
        const transformedDataName = bridge.transf(dataName);

        if (storedData.lists && storedData.lists[transformedDataName]) {
          listData = storedData.lists[transformedDataName];
        }
      } catch (error) {
        storedData.lists = {};
        bridge.data.IO.write(storedData);
      }

      bridge.store(storeLocation, listData);
    }
  },
};
