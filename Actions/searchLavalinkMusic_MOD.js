modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Search Lavalink Music",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "channel",
      name: "Voice Channel",
      storeAs: "voiceChannel",
      excludeUsers: true,
    },
    {
      element: "input",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Results As",
      storeAs: "store",
    },
    {
      element: "store",
      name: "Store Load Type As",
      storeAs: "storeLoadType",
    },
    {
      element: "store",
      name: "Store Tracks Results As",
      storeAs: "storeTracks",
    },
    "-",
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If Error",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `Search: ${values.query}`
  },

  async run(values, message, client, bridge) {
    const voiceChannel = await bridge.getChannel(values.voiceChannel)
    const query = bridge.transf(values.query) || `Rick Astley - Never Gonna Give You Up`

    if (!client.lavalink.nodeManager.nodes.size) {
      console.log("No lavalink connection found, please connect first.")
      return bridge.runner(values.ifError, values.ifErrorActions)
    }

    try {
      let player = client.lavalink.getPlayer(bridge.guild.id)

      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: bridge.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: message.channel.id,
        })
      }

      const result = await player.search(
        {
          query,
          source: "ytsearch",
        },
        message.author || message.user
      )

      if (!result || !result.tracks || result.tracks.length === 0) {
        console.log("No tracks found for the query:", query)
        return bridge.runner(values.ifError, values.ifErrorActions)
      }

      bridge.store(values.store, result)
      bridge.store(values.storeLoadType, result.loadType)
      bridge.store(values.storeTracks, result.tracks)
    } catch (error) {
      console.log("Lavalink Music Error", error)
      bridge.runner(values.ifError, values.ifErrorActions)
    }
  },
}
