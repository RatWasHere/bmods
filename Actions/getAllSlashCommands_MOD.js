modVersion = "v.u1.0"
module.exports = {
  data: {
    name: "Get All Slash Command Names",
  },
  category: "Bot",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "store",
      storeAs: "store",
      name: "Store Command Name List As",
    },
    {
      element: "store",
      storeAs: "idStore",
      name: "Store Command Custom Id List As"
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (data, constants) => {
    return `List stored as: ${constants.variable(data.store)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const jsonData = require('../data.json');
    const commands = jsonData.commands;

    const commandList = [];
    const idList = []

    commands.forEach(command => {
      if (command.trigger === 'slashCommand') {
        commandList.push(command.name);
        idList.push(command.customId)
      }
    });

    bridge.store(values.store, commandList);
    bridge.store(values.idStore, idList)
  }
};
