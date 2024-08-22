/*
  Send Rcon Command Mod by candiedapple
  Licensed under MIT License

  Lets you send rcon commands to servers.
*/
module.exports = {
  data: {
    name: "Send Rcon Command",
  },
  category: "Game",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      storeAs: "serverip",
      name: "Server IP",
    },
    {
      element: "input",
      storeAs: "serverport",
      name: "Server Port",
    },
    {
      element: "input",
      storeAs: "rconpassword",
      name: "Rcon Password",
    },
    {
      element: "input",
      storeAs: "command",
      name: "Command",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Save response as",
    },
  ],

  subtitle: (data) => {
    return `Command: ${data.command}`;
  },

  run(values, interaction, client, bridge) {
    return new Promise((resolve, reject) => {
      const Rcon = require("mbr-rcon");
      const rconConfig = {
        host: `${bridge.transf(values.serverip)}`,
        port: `${bridge.transf(values.serverport)}`,
        pass: `${bridge.transf(values.rconpassword)}`,
      };
      const rcon = new Rcon(rconConfig);

      const connection = rcon.connect({
        onSuccess: () => {
          console.log("Connected to RCON server");
          connection.auth({
            onSuccess: () => {
              console.log("Authenticated successfully");
              connection.send(`${bridge.transf(values.command)}`, {
                onSuccess: (response) => {
                  console.log("Server response:", response);
                  bridge.store(values.store, response);
                  connection.close();
                  resolve(response);
                },
                onError: (error) => {
                  console.error("Error executing command:", error);
                  connection.close();
                  reject(error);
                },
              });
            },
            onError: (error) => {
              console.error("Authentication error:", error);
              connection.close();
              reject(error);
            },
          });
        },
        onError: (error) => {
          console.error("Connection error:", error);
          reject(error);
        },
      });
    });
  },
};
