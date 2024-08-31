module.exports = {
  data: {
    name: "Get Command Alias(es)",
  },
  category: "Bot",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "commandname",
      name: "Command Name",
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Alias List As",
    },
  ],

  subtitle: (data) => {
    return `Store ${data.commandname}'s Alias(es)`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const commandName = bridge.transf(values.commandname);
    const jsonData = require('../data.json');
    const commands = jsonData.commands;

    const foundCommand = commands.find(cmd => cmd.name === commandName);
    if (foundCommand.trigger === 'textCommand'){
      if (foundCommand.aliases && foundCommand.aliases.length > 0){
        bridge.store(values.store, foundCommand.aliases);
      }
      else {
        bridge.store(values.store, `No alias(es) are available for "${values.commandname}".`);
      }
    }
    else {
      bridge.store(values.store, `"${values.commandname}" is not a text command.`)
    }
  }
};
