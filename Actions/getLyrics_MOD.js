modVersion = "v1.0.9";

module.exports = {
  data: {
    name: "Get Lyrics",
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
      element: "input",
      storeAs: "lyricChoice",
      name: "Use Result #",
      placeholder: "Starts From #1"
    },
    {
      element: "storageInput",
      name: "Store Lyrics Object As",
      storeAs: "store",
    },
    {
      element: "store",
      name: "Store Lyrics Object List As",
      storeAs: "allResults"
    },
    "-",
    {
      element: "condition",
      name: "If No Lyrics Found",
      storeAs: "noLyrics",
      storeActionsAs: "noLyricsAction"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (values, constants, thisAction) => {
    return `Get Lyrics - ${values.query}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { useQueue, QueueRepeatMode } = await client
      .getMods()
      .require("discord-player", "7.2.0-dev.2");

    const query = bridge.transf(values.query);

    const lyrics = await client.player.lyrics
      .search({ q: query })
      .catch((error) => console.error(error));

    if (!lyrics[0]){
      bridge.store(values.store, undefined)
      bridge.store(values.allResults, undefined)
      bridge.call(values.noLyrics, values.noLyricsAction)
    } else {
      let lyricNum = (parseInt(Math.floor(bridge.transf(values.lyricChoice))) - 1) || 0
      if (!isNaN(lyricNum) && !lyrics[lyricNum]){
        bridge.store(values.store, lyrics[0])
      } else if (!isNaN(lyricNum)){
        bridge.store(values.store, lyrics[lyricNum])
      } else if (isNaN(lyricNum)){
        bridge.store(values.store, `${values.lyricChoice} is not a valid number.`)
      }
      bridge.store(values.allResults, lyrics)
    }
  },
};
