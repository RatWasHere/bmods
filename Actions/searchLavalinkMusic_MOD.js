modVersion = "v1.1.1"
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
      console.log(`[${this.data.name}] No Lavalink Connection Found, Please Connect First.`)
      await bridge.runner(values.ifError, values.ifErrorActions)
      return
    }

    let node
    if (client.lavalink.bmdManager) {
      function getHealthyNode(client) {
        const nodes = [...client.lavalink.bmdManager.states.active.values()].filter((n) => n.connected)

        if (!nodes.length) return null

        return nodes.sort((a, b) => a.stats.playingPlayers - b.stats.playingPlayers)[0]
      }

      node = getHealthyNode(client)
      if (!node) {
        console.log(`[${this.data.name}] No Healthy Lavalink Nodes Found.`)
        await bridge.runner(values.ifError, values.ifErrorActions)
        return
      }
    }

    try {
      let player = client.lavalink.getPlayer(bridge.guild.id)

      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: bridge.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: message.channel.id,
          node,
        })
      }

      const result = await player.search(
        {
          query,
          source: "ytsearch",
        },
        message.author || message.user,
      )

      if (!result || !result.tracks || result.tracks.length === 0) {
        console.log(`[${this.data.name}] No Tracks Found For The Query:`, query)
        await bridge.call(values.ifError, values.ifErrorActions)
        return
      }

      bridge.store(values.store, result)
      bridge.store(values.storeLoadType, result.loadType)
      bridge.store(values.storeTracks, result.tracks)
    } catch (error) {
      console.log(`[${this.data.name}] ${node.id} Lavalink Music Error`, error)
      await bridge.call(values.ifError, values.ifErrorActions)
    }
  },
}
