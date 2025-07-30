modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Get Lavalink Player",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "text",
      text: "Use this action to get the player variable from an interaction variable.",
    },
    "-",
    {
      element: "variable",
      name: "Interaction Variable",
      storeAs: "interactionVariable",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Player As",
      storeAs: "store",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `Store As: ${constants.variable(values.store)}`;
  },

  async run(values, message, client, bridge) {
    const interaction = await bridge.get(values.interactionVariable);

    const player = client.lavalink.getPlayer(interaction.guild.id);

    return bridge.store(values.store, player);
  },
};
