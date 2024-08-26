module.exports = {
  data: {
    name: "Get Commands Info",
  },
  category: "Bot",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      storeAs: "noFolderName",
      name: "The value that will be used when a command has no folder name",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "commandList",
      name: "Store Command Infos in List As",
    },
    "-",
  ],

  compatibility: ["Any"],
  run(values, message, client, bridge) {

    try {
      // Load the JSON data
      const jsonData = require('../data.json');

      // Access the commands array
      const commands = jsonData.commands;
      const folders = jsonData.folders;

      // Check if the commands property is an array
      if (!Array.isArray(commands)) {
        throw new Error('Commands property is not an array');
      }

      // Initialize an array for command objects
      const commandList = [];

      // Extract command names, descriptions, triggers, and folder names
      commands.forEach(command => {
        if (command.trigger !== 'event') {
          // Get the folder name using the folder ID
          const folderId = command.folder[0]; // Assuming each command has only one folder ID
          const folderName = folders[folderId] ? folders[folderId].name : `${values.noFolderName}`;

          // Construct the command object
          const commandObject = {
            commandname: command.name,
            commanddescription: command.description,
            commandtrigger: command.trigger,
            commandfolder: folderName
          };

          // Push the command object into the array
          commandList.push(commandObject);
        }
      });

      bridge.store(values.commandList, commandList);


    } catch (error) {
      console.error('Error loading or processing JSON data:', error);
    }

  },
};