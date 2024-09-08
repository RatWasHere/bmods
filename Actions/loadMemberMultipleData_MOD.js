module.exports = {
  data: {
    name: "Get Member Multiple Datas",
  },
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Member Data",
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
    },
    "-",
    {
      element: "userInput",
      storeAs: "member",
      name: "Member",
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
    return `Label: ${values.label}, Retrieve ${values.retrievelist.length} datas of ${constants.user(values.member)}.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {

    let storedData = bridge.data.IO.get();
    let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : '';
    let user = await bridge.getUser(values.member);
    let id = `${user.member.guild.id}${user.id}`;

    for (let item of values.retrievelist) {
      let memberData = defaultVal;

      const dataName = item.data.dataname;
      const storeLocation = item.data.store;

      try {
        const transformedDataName = bridge.transf(dataName);

        if (storedData.members && storedData.members[id] && storedData.members[id][transformedDataName]) {
          memberData = storedData.members[id][transformedDataName];
        }
      }
      
      catch (error) {
        storedData.members[id] = {};
        bridge.data.IO.write(storedData);
      }

      bridge.store(storeLocation, memberData);
    }
  }
}