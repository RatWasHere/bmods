modVersion = "v1.2.2"
module.exports = {
  data: {
    name: "Search Lavalink Music",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
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
    {
      element: "typedDropdown",
      storeAs: "source",
      name: "Search Source",
      choices: {
        ytsearch: { name: "YouTube", field: false, category: "Universal w/o Plugins (Safest)" },
        ytmsearch: { name: "YouTube Music", field: false },
        scsearch: { name: "SoundCloud", field: false },

        // Lavalink Plugins only
        speak: { name: "Free TTS (DuncteBot Sources)", field: false, category: "Lavalink + Plugins" },
        tts: { name: "Google Cloud TTS (DuncteBot TTS)", field: false },

        // Lavalink Plugins + NodeLink
        spsearch: { name: "Spotify", field: false, category: "Lavalink + Plugins / NodeLink" },
        sprec: { name: "Spotify Recommendations", field: false },
        amsearch: { name: "Apple Music", field: false },
        dzsearch: { name: "Deezer", field: false },
        dzisrc: { name: "Deezer ISRC", field: false },
        ymsearch: { name: "Yandex Music", field: false },
        ftts: { name: "Flowery TTS", field: false },
        flowery: { name: "Flowery TTS (alias)", field: false },

        // NodeLink Exclusive
        search: { name: "Unified Search", field: false, category: "NodeLink Only" },
        tdsearch: { name: "Tidal", field: false },
        bcsearch: { name: "Bandcamp", field: false },
        admsearch: { name: "Audiomack", field: false },
        audiomack: { name: "Audiomack (alias)", field: false },
        gaanasearch: { name: "Gaana", field: false },
        jssearch: { name: "JioSaavn", field: false },
        lfsearch: { name: "Last.fm", field: false },
        pdsearch: { name: "Pandora", field: false },
        vksearch: { name: "VK Music", field: false },
        mcsearch: { name: "Mixcloud", field: false },
        ncsearch: { name: "NicoVideo", field: false },
        nicovideo: { name: "NicoVideo (alias)", field: false },
        bilibili: { name: "Bilibili", field: false },
        shsearch: { name: "Shazam", field: false },
        szsearch: { name: "Shazam (alias)", field: false },
        ebox: { name: "Eternal Box", field: false },
        jukebox: { name: "Eternal Box (alias)", field: false },
        slsearch: { name: "Songlink (Odesli)", field: false },
        qbsearch: { name: "Qobuz", field: false },
        ausearch: { name: "Audius", field: false },
        azsearch: { name: "Amazon Music", field: false },
        agsearch: { name: "Anghami", field: false },
        bksearch: { name: "Bluesky", field: false },
        lmsearch: { name: "Letras.mus.br", field: false },
        pipertts: { name: "Piper TTS (Local)", field: false },
        gtts: { name: "Google TTS", field: false },
        ytrec: { name: "YouTube Recommendations", field: false },
        dzrec: { name: "Deezer Recommendations", field: false },
        tdrec: { name: "Tidal Recommendations", field: false },
        jsrec: { name: "JioSaavn Recommendations", field: false },
        vkrec: { name: "VK Music Recommendations", field: false },

        others: { name: "Others", field: true, category: "Others" },
      },
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

    // if (!client.lavalink.nodeManager.nodes.size) {
    //   console.log(`[${this.data.name}] No Lavalink Connection Found, Please Connect First.`)
    //   await bridge.runner(values.ifError, values.ifErrorActions)
    //   return
    // }

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
        await bridge.call(values.ifError, values.ifErrorActions)
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

      let source = values.source.type ? bridge.transf(values.source.type) : "ytsearch"
      if (source == "others") {
        source = bridge.transf(values.source.value)
      }
      const result = await player.search(
        {
          query,
          source,
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
