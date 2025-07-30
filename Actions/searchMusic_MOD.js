module.exports = {
  data: {
    name: "Search Music",
  },
  category: "Discord-Player Music",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["discord-player"],
  UI: [
    {
      element: "input",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Tracks As",
      storeAs: "store",
    },
  ],
  subtitle: (data, constants) => {
    return `Search: ${data.query}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const query = await bridge.transf(values.query);

    const data = await client.player.search(query, {
      requestedBy: message.author?.id || message.user?.id,
    });

    return bridge.store(values.store, data.tracks);
  },
};
