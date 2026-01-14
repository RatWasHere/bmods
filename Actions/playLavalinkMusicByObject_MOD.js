modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Play Lavalink Music Via Track Object",
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
    "-",
    {
      element: "variable",
      name: "Track Object",
      storeAs: "trackObject",
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

  subtitle: (data, values, constants) => {
    return `Play: (${values.trackObject.type})${values.trackObject.value}`
  },

  async run(values, message, client, bridge) {
    const voiceChannel = await bridge.getChannel(values.voiceChannel)
    const trackObject = bridge.get(values.trackObject)

    if (!voiceChannel) {
      console.log(`[${this.data.name}] Voice Channel Not Found Or Not Specified.`)
      return bridge.runner(values.ifError, values.ifErrorActions)
    }

    if (!client.lavalink.nodeManager.nodes.size) {
      console.log(`No Lavalink Connection Found, Please Connect First.`)
      return bridge.runner(values.ifError, values.ifErrorActions)
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

      await player.queue.add(trackObject)

      // Start playing if not already playing
      if (!player.playing && !player.paused) {
        await player.play()
      }
    } catch (error) {
      console.log(`[${this.data.name}] Lavalink Music Error`, error)
      bridge.runner(values.ifError, values.ifErrorActions)
    }
  },
}
