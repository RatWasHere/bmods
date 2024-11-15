module.exports = {
  data: {
    name: "Get Multiple Server Datas",
  },
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Server Data",
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
    },
    "-",
    {
      element: "guild",
      storeAs: "guild",
      name: "Server",
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
      name: "List of Server Datas",
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
    return `Label: ${values.label}, Retrieve ${values.retrievelist.length} datas of ${constants.guild(values.guild)}.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : '';
    let guild = await bridge.getGuild(values.guild);

    for (let item of values.retrievelist) {
      let guildData = defaultVal;

      const dataName = item.data.dataname;
      const storeLocation = item.data.store;

      try {
        const transformedDataName = bridge.transf(dataName);

        if (storedData.guilds && storedData.guilds[guild.id] && storedData.guilds[guild.id][transformedDataName]) {
          guildData = storedData.guilds[guild.id][transformedDataName];
        }
      }
      
      catch (error) {
        storedData.guilds[guild.id] = {};
        bridge.data.IO.write(storedData);
      }

      bridge.store(storeLocation, guildData);
    }
  }
}