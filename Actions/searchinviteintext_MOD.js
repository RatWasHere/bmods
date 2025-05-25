/*
A mod that allows you to find out if there is an active invitation to the discord server in the text and if there is, then take information from it
*/
module.exports = {
  modules: ["is-discord-invite"],
  data: {
    name: "Search invite in text / info",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
  },
  category: "Text",

  UI: [
    {
      element: "largeInput",
      name: "Text",
      storeAs: "text",
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "Informations",
      types: {
        informations: "Informations",
      },
      max: 200,
      UItypes: {
        informations: {
          name: "Invite info",
          preview: "`Selected: ${option.data.info}`",
          data: { info: "Status (true/false)" },
          UI: [
            {
              element: "dropdown",
              storeAs: "info",
              name: "Invite info",
              choices: [
                { name: "Status (true/false)" },
                { name: "Invitation Link" },
                { name: "The invitation code" },
                { name: "User ID" },
                { name: "Global User Name" },
                { name: "User's username" },
                { name: "Name of the server" },
                { name: "Server ID" },
              ],
            },
            "-",
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
  subtitle: (data, constants) => {
    return `${data.text} `;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const text = bridge.transf(values.text);

    const IsInvitation = await client.getMods().require("is-discord-invite");
    const Invite = await IsInvitation.online(text);

    for (const infoCase of values.cases) {
      if (infoCase.type !== "informations") continue;

      let output;
      switch (infoCase.data.info) {
        case "Status (true/false)":
          output = Invite.isInvitation;
          break;
        case "Invitation Link":
          output = Invite?.url?.full;
          break;
        case "The invitation code":
          output = Invite?.url?.invitationCode;
          break;
        case "User ID":
          output = Invite?.inviter?.id;
          break;
        case "Global User Name":
          output = Invite?.inviter?.global_name;
          break;
        case "User's username":
          output = Invite?.inviter?.username;
          break;
        case "Name of the server":
          output = Invite?.guild?.name;
          break;
        case "Server ID":
          output = Invite?.guild?.id;
          break;
      }

      bridge.store(infoCase.data.store, output);
    }
  },
};
