const jsonData = require('../data.json');
const commands = jsonData.commands;
const txtCmdPrefix = jsonData.prefix;

module.exports = {
  data: {
    name: "Get Command Info",
  },
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Bot",
  UI: [
    {
      element: "typedDropdown",
      storeAs: "commandId",
      name: "Command",
      choices: (() => {
        let result = {};
        commands.forEach(command => {

          let cmdtrigger;
          switch (command.trigger) {
            case "textCommand":
              cmdtrigger = "Text Command";
              break;
            case "slashCommand":
              cmdtrigger = "Slash Command";
              break;
            case "messageContent":
              cmdtrigger = "Message Content";
              break;
            case "message":
              cmdtrigger = "Message Menu";
              break;
            case "user":
              cmdtrigger = "User Menu";
              break;
            case "event":
              cmdtrigger = "Event";
              break;
          }
          
          result[command.customId] = { name: `(${cmdtrigger}) ${command.name} - ${command.customId}` || `<i>[No Name]</i>` , field: false}
        
        });
        return result;
      })()
    },
    "-",
    {
      element: "store",
      storeAs: "cmdname",
      name: "Command Name",
    },
    {
      element: "store",
      storeAs: "cmdtype",
      name: "Command Type",
    },
    {
      element: "store",
      storeAs: "cmdtrig",
      name: "Command Trigger",
    },
    {
      element: "store",
      storeAs: "cmdalis",
      name: "Command Aliases List"
    },
    {
      element: "store",
      storeAs: "cmdactn",
      name: "Command Actions List",
    },
    {
      element: "store",
      storeAs: "cmdcuid",
      name: "Command BMD Custom ID",
    },
    {
      element: "store",
      storeAs: "cmdbund",
      name: "Command Boundary",
    },
    {
      element: "store",
      storeAs: "cmdperm",
      name: "Command Permissions",
    },
    {
      element: "store",
      storeAs: "cmdpram",
      name: "Command Parameters List"
    },
    {
      element: "store",
      storeAs: "cmddesc",
      name: "Command Description",
    },
    {
      element: "store",
      storeAs: "cmdfldr",
      name: "Command BMD Folder ID",
    }
  ],

  subtitle: (actionData) => {
    let foundCommand;
    for (let cmd in commands) {
      let command = commands[cmd];
      if (command.customId == actionData.commandId.type) {
        foundCommand = command;
      }
    }

    if (!foundCommand) {
      return `Command With CustomID ${actionData.commandId.type} Not Found!`
    } else {
      return `Command Name: ${foundCommand.name} - ${foundCommand.customId}`
    }
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let command = commands.find(cmd => cmd.customId == bridge.transf(values.commandId.type));
    if (!command) {
      const reply = [];
      reply.push(`Command with CustomID ${values.commandId.type} not found!`);
      bridge.store(values.cmdname, reply);
      bridge.store(values.cmdtype, reply);
      bridge.store(values.cmdtrig, reply);
      bridge.store(values.cmdalis, reply);
      bridge.store(values.cmdactn, reply);
      bridge.store(values.cmdcuid, reply);
      bridge.store(values.cmdbund, reply);
      bridge.store(values.cmdperm, reply);
      bridge.store(values.cmdpram, reply);
      bridge.store(values.cmddesc, reply);
      bridge.store(values.cmdfldr, reply);
    }

    else {
      const commandname = [];
      const commandtype = [];
      const commandtrigger = [];
      const commandaliases = [];
      const commandactions = [];
      const commandcustomid = [];
      const commandboundary = [];
      const commandpermissions = [];
      const commandparameters = [];
      const commanddescription = [];
      const commandfolder = [];

      if (command.name) {
        commandname.push(command.name);
      } else {commandname.push(`No Name`);}

      if (command.type) {
        commandtype.push(command.type);
      } else {commandtype.push(`No Type`);}

      if (command.trigger) {
        commandtrigger.push(command.trigger);
      } else {commandtrigger.push(`No Trigger`);}

      if (command.aliases && command.aliases.length > 0) {
        command.aliases.forEach(alias => {
          commandaliases.push(alias);
        })
      } else {commandaliases.push(`No Aliases`);}

      if (command.actions && command.actions.length > 0) {
        command.actions.forEach(action => {
          commandactions.push(action.name);
        })
      } else {commandactions.push(`No Actions`);}

      if (command.customId) {
        commandcustomid.push(command.customId);
      } else {commandcustomid.push(`No CustomId`);}

      if (command.boundary && command.boundary.worksIn){
        commandboundary.push(command.boundary.worksIn);
      } else {commandboundary.push(`No Boundary Stated`);}

      if (command.boundary && command.boundary.limits && command.boundary.limits.length > 0){
        command.boundary.limits.forEach(limit => {
          commandpermissions.push(limit)
        })
      } else {commandpermissions.push(`No Permissions Required`);}

      if (command.parameters && command.parameters.length > 0){
        command.parameters.forEach(parameter => {
          commandparameters.push(parameter.name);
        })
      } else{commandparameters.push(`No Parameters`);}

      if (command.description) {
        commanddescription.push(command.description);
      } else {commanddescription.push(`No Description`);}

      if (command.folder) {
        commandfolder.push(command.folder);
      } else {commandfolder.push(`No Folder`);}

      bridge.store(values.cmdname, commandname);
      bridge.store(values.cmdtype, commandtype);
      bridge.store(values.cmdtrig, commandtrigger);
      bridge.store(values.cmdalis, commandaliases);
      bridge.store(values.cmdactn, commandactions);
      bridge.store(values.cmdcuid, commandcustomid);
      bridge.store(values.cmdbund, commandboundary);
      bridge.store(values.cmdperm, commandpermissions);
      bridge.store(values.cmdpram, commandparameters);
      bridge.store(values.cmddesc, commanddescription);
      bridge.store(values.cmdfldr, commandfolder);
    }
  }
}