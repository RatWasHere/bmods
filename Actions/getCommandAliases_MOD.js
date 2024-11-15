const jsonData = require('../data.json');
const commands = jsonData.commands;
const prefix = jsonData.prefix;

module.exports = {
  data: {
    name: "Get Command Aliases",
  },
  category: "Bot",
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
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
    {
      element: "text",
      text: `<div style="font-size: 20px; color: red; text-align: center;">
      This action is deprecated, use "Get Command Info" for a more robust & feature rich option.
      </div>`
    }
  ],

  subtitle: (data) => {
    return `Store ${data.commandname}'s Aliases`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const commandName = bridge.transf(values.commandname);

    const foundCommand = commands.find(cmd => cmd.name === commandName && cmd.trigger === 'textCommand');

    if (!foundCommand) {
      const NotTextCommandError = [];
      NotTextCommandError.push(`\`${values.commandname}\` isn't a text command.`);
      bridge.store(values.store, NotTextCommandError);
    }

    else {

      if (foundCommand.aliases && foundCommand.aliases.length > 0) {
        bridge.store(values.store, foundCommand.aliases);
      }

      else {
        const NoAliasesError = [];
        NoAliasesError.push(`No aliases available for \`${prefix}${values.commandname}\`.`);
        bridge.store(values.store, NoAliasesError);
      }
    }
  }
};
