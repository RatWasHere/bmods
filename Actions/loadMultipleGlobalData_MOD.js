module.exports = {
  data: { name: "Load Multiple Global Data" },
  category: "Global Data",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "defaultval",
      name: "Default value",
    },
    "-",
    {
      element: "menu",
      storeAs: "retrievelist",
      name: "Global data",
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
              name: "Global data name",
            },
            {
              element: "store",
              storeAs: "store",
            },
          ],
        },
      },
    },
  ],
  subtitle: (data) => {
    return `Store ${data.retrievelist.length} global data(s).`;
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
