module.exports = {
  data: {
    name: "Get Channel Multiple Datas",
  },
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Channel Data",
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
    },
    "-",
    {
      element: "channelInput",
      storeAs: "channel",
      name: "Channel",
    },
    {
      element: "input",
      storeAs: "defaultval",
      name: "Default Value",
    },
    "-",
    {
      element: "menu",
      storeAs: "retrievelist",
      name: "List of Channel Datas",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes:{
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
              name: "Store As",
            },
          ],
        },
      },
    },
  ],

  subtitle: (values, constants) => {
    return `Label: ${values.label}, Retrieve ${values.retrievelist.length} datas of ${constants.channel(values.channel)}.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : '';
    let channel = await bridge.getChannel(values.channel)

    for (let item of values.retrievelist) {
      let channelData = defaultVal;

      const dataName = item.data.dataname;
      const storeLocation = item.data.store;

      try {
        const transformedDataName = bridge.transf(dataName);

        if (storedData.channels && storedData.channels[channel.id] && storedData.channels[channel.id][transformedDataName]) {
          channelData = storedData.channels[channel.id][transformedDataName];
        }
      }
      
      catch (error) {
        storedData.channels[channel.id] = {};
        bridge.data.IO.write(storedData);
      }

      bridge.store(storeLocation, channelData);
    }
  }
}