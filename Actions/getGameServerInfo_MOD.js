/*
  Get Game Server Info mod by candiedapple
  Licensed under MIT License

  Gets Game server info.
*/
module.exports = {
  data: {
    name: "Get Game Server Info",
  },
  category: "Game",
  UI: [
    {
      element: "input",
      storeAs: "gametype",
      name: "Game Type",
    },
    {
      element: "input",
      storeAs: "host",
      name: "Host",
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "servername",
      name: "Server Name",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "servermap",
      name: "Server Map",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "password",
      name: "Is Password Required",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "numplayers",
      name: "Number of players connected.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "maxplayers",
      name: "Maximum number of players can connect.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "raw",
      name: "Contains all information received from the server in a disorganized format. (object)",
    },
  ],

  async run(values, interaction, client, bridge) {
    return new Promise((resolve, reject) => {
      const { GameDig } = require('gamedig');

      GameDig.query({
        type: bridge.transf(values.gametype),
        host: bridge.transf(values.host),
        port: bridge.transf(values.port),
        givenPortOnly: true // the library will attempt multiple ports in order to ensure success, to avoid this pass this option
      }).then((state) => {
        console.log(state);
        bridge.store(values.servername, state.name);
        bridge.store(values.servermap, state.map);
        bridge.store(values.password, state.password);
        bridge.store(values.numplayers, state.numplayers);
        bridge.store(values.maxplayers, state.maxplayers);
        bridge.store(values.raw, state.raw);
        resolve(); // Resolve the promise once all operations are completed
      }).catch((error) => {
        bridge.store(values.servername, error);
        bridge.store(values.servermap, error);
        bridge.store(values.password, error);
        bridge.store(values.numplayers, error);
        bridge.store(values.maxplayers, error);
        bridge.store(values.raw, error);
        reject(error); // Reject the promise if there is an error
      });
    });
  }

};
