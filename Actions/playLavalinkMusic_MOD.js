module.exports = {
  data: {
    name: "Play Lavalink Music",
    source: { type: "ytsearch", value: "" },
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/ratWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/Donate",
  },
  modules: ["lavalink-client"],
  UI: [
    {
      element: "channel",
      name: "Voice Channel",
      storeAs: "voiceChannel",
      excludeUsers: true,
    },
    "-",
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
      element: "toggle",
      storeAs: "selfDeaf",
      name: "Self Deaf?",
    },
    "-",
    {
      element: "input",
      name: "Default Volume",
      storeAs: "defaultVolume",
      placeholder: "Leave blank for 100",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
    "-",
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If Error",
    },
  ],
  compatibility: ["Any"],

  subtitle: (data, constants) => {
    return `Play: ${data.query}`
  },

  async run(values, message, client, bridge) {
    const voiceChannel = await bridge.getChannel(values.voiceChannel)
    const query = bridge.transf(values.query)

    if (!voiceChannel) {
      console.log("Voice channel not found or not specified.")
      await bridge.call(values.ifError, values.ifErrorActions)
      return
    }

    if (!client.lavalink.nodeManager.nodes.size) {
      console.log("No lavalink connection found, please connect first.")
      await bridge.call(values.ifError, values.ifErrorActions)
      return
    }

    try {
      let player = client.lavalink.getPlayer(bridge.guild.id)

      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: bridge.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: message.channel.id,
          selfDeaf: values.selfDeaf,
          selfMute: false,
        })
      }

      if (!player.connected) {
        await player.connect()
      }

      if (values.defaultVolume) {
        const volume = bridge.transf(values.defaultVolume)
        await player.setVolume(Number(volume))
      }

      let source = values.source.type ? bridge.transf(values.source.type || values.source) : "ytsearch"
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
        console.log("No tracks found for the query:", query)
        await bridge.call(values.ifError, values.ifErrorActions)
        return
      }

      if (result.loadType === "playlist") {
        await player.queue.add(result.tracks)
      } else {
        await player.queue.add(result.tracks[0])
      }

      // Start playing if not already playing
      if (!player.playing && !player.paused) {
        await player.play()
      }

      return bridge.store(values.store, result)
    } catch (error) {
      console.log("Lavalink Music Error", error)
      await bridge.call(values.ifError, values.ifErrorActions)
    }
  },
}
