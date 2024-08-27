/*
  Pterodactyl mod by qschnitzel
  Licensed under MIT License

  Manage your individual Pterodactyl servers.
  Made for Pandora Network.
*/
module.exports = {
  data: {
    name: "Pterodactyl",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "API",
  UI: [
    {
      element: "input",
      storeAs: "targeturl",
      name: "Server Base URL",
    },
    "-",
    {
      element: "input",
      storeAs: "apitoken",
      name: "API Token",
    },
    "-",
    {
      element: "input",
      storeAs: "serverid",
      name: "Server ID",
    },
    "-",
    {
      element: "input",
      storeAs: "action",
      name: "Action To Perform",
      placeholder: "e.g. power, command, ...",
    },
    "-",
    {
      element: "input",
      storeAs: "pterodactyldata",
      name: "JSON To POST",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If Fails, Run",
    },
  ],

  async run(values, interaction, client, bridge) {
    const baseURL = bridge.transf(values.targeturl);
    const token = bridge.transf(values.apitoken);
    const serverId = bridge.transf(values.serverid);
    const action = bridge.transf(values.action);
    const data = bridge.transf(values.pterodactyldata);

    const url = `${baseURL}/servers/${serverId}/${action}`;

    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!(response.status == 204 || 200)) {
      await bridge.call(values.false, values.falseActions);
      console.log(response.status, response.statusText);
    }
  },
};
