module.exports = {
  data: {
    name: "Get All Text Commands",
  },
  category: "Bot",
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "store",
      storeAs: "store",
      name: "Store Commands List As",
    },
  ],

  subtitle: (data, constants) => {
    return `List stored as: ${constants.variable(data.store)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const jsonData = require('../data.json');
    const commands = jsonData.commands;

    const commandList = [];

    commands.forEach(command => {
      if (command.trigger === 'textCommand') {
        commandList.push(command.name);
      }
    });

    bridge.store(values.store, commandList);
  }
};
