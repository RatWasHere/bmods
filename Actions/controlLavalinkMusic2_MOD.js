modVersion = "v1.1.0"
const indexByStoreAs = (values, storeAs) => {
  if (typeof storeAs != "string") {
    return console.log("Not String")
  }
  let index = values.UI.findIndex((element) => element.storeAs == storeAs)
  console.log(index)
  if (index == -1) {
    return console.log("Index Not Found")
  }
  return index
}
module.exports = {
  data: {
    name: "Control Lavalink Music 2",
  },
  aliases: [],
  modules: ["lavalink-client"],
  category: "Lavalink Music",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "player",
      name: "Player (Leave Empty To Get The Current Server's Player)",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "action",
      name: "Music Action",
      choices: {
        pause: { name: "Pause Music", field: false },
        resume: { name: "Resume Music", field: false },
        stop: { name: "Stop Music Playback", field: false },
        destroy: { name: "Destroy Player", field: false },
        connect: { name: "Connect Player (Same Node)", field: false },
        connectDifferent: { name: "Connect Player (Change Node)", field: false },
        volume: { name: "Set Volume", field: true },
        skip: { name: "Skip Current Track", field: false },
        skipTo: { name: "Skip To Track #", field: true, placeholder: "#" },
        remove: { name: "Remove Track #", field: true, placeholder: "#" },
        clear: { name: "Clear Queue", field: false },
        shuffle: { name: "Shuffle Queue", field: false },
        previous: { name: "Play Previous Song", field: false },
        repeat: { name: "Set Repeat Mode", field: false },
      },
    },
    "_",
    {
      element: "",
      storeAs: "repeatMode",
      name: "Repeat Mode",
      choices: {
        off: { name: "Off", field: false },
        track: { name: "Repeat Current Track", field: false },
        queue: { name: "Repeat Current Queue", field: false },
      },
    },
    "_",
    {
      element: "text",
      text: "Will Do Nothing If No Music Is Playing, No Previous Track Or Incorrect Track Numbers.",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  script: (values) => {
    function reflem(skipAnimation) {
      let actionType = values.data.action.type
      switch (actionType) {
        case "repeat": {
          values.UI[indexByStoreAs(values, "repeatMode")].element = "typedDropdown"
          break
        }

        default: {
          values.UI[indexByStoreAs(values, "repeatMode")].element = ""
          break
        }
      }

      setTimeout(() => {
        values.updateUI()
      }, values.commonAnimation * 100)
    }

    reflem(true)

    values.events.on("change", reflem)
  },

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let subtitlePart
    switch (values.action.type) {
      case "volume": {
        subtitlePart = `Set Player Volume To ${values.action.value}`
        break
      }

      case "skipTo": {
        subtitlePart = `Skip To Track ${values.action.value}`
        break
      }

      case "remove": {
        subtitlePart = `Remove Track #${values.action.value}`
      }

      case "repeat": {
        switch (values.repeatMode.type) {
          case "off": {
            subtitlePart = `Set Repeat Mode To Off`
            break
          }

          case "track": {
            subtitlePart = `Set Repeat Mode To Loop Current`
            break
          }

          case "queue": {
            subtitlePart = `Set Repeat Mode To Loop Queue`
          }
        }
        break
      }

      default: {
        subtitlePart = `${thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.action.type].name}`
        break
      }
    }

    return `Control Lavalink Music - ${subtitlePart}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }
    let actionType = bridge.transf(values.action.type)
    let player

    if (values.player?.value !== "") {
      try {
        player = bridge.get(values.player)
      } catch {}
    }

    if (!player) {
      player = client.lavalink.getPlayer(bridge.guild.id)
    }

    if (!player) {
      return console.error(`[${this.data.name}] Player Not Found`)
    }

    function getHealthyNode(client) {
      const nodes = [...client.lavalink.bmdManager.states.active.values()].filter((n) => n.connected)

      if (!nodes.length) return null

      return nodes.sort((a, b) => a.stats.playingPlayers - b.stats.playingPlayers)[0]
    }

    switch (actionType) {
      case "skip": {
        if (player.queue.tracks.length == 0) {
          await player.stopPlaying()
        } else {
          await player.skip()
        }
        break
      }

      case "skipTo": {
        let trackNumber = Number(bridge.transf(values.action.value)) - 1
        if (!player.queue.tracks[trackNumber]) {
          break
        }
        await player.queue.splice(0, trackNumber)
        await player.skip()
        break
      }

      case "previous": {
        let previousTrack = await player.queue.shiftPrevious()
        if (!previousTrack) {
          break
        }
        await player.play({ clientTrack: previousTrack })
        break
      }

      case "queue": {
        await player.queue.tracks.splice(0)
        break
      }

      case "shuffle": {
        await player.queue.shuffle()
        break
      }

      case "remove": {
        let queueLength = player.queue.tracks.length
        let trackNumber = Number(bridge.transf(values.action.value)) - 1
        if (trackNumber < 0 || trackNumber >= queueLength || !player.queue.tracks[trackNumber]) {
          break
        }
        await player.queue.remove(trackNumber)
        break
      }

      case "volume": {
        await player.setVolume(Number(bridge.transf(values.action.value)) || 100)
        break
      }

      case "repeat": {
        await player.setRepeatMode(bridge.transf(values.repeatMode.type))
        break
      }

      case "pause": {
        await player.pause()
        break
      }

      case "resume": {
        await player.resume()
        break
      }

      case "stop": {
        await player.stopPlaying()
        break
      }

      case "destroy": {
        await player.destroy()
        break
      }

      case "connect": {
        await player.connect()
        break
      }

      case "connectDifferent": {
        if (client.lavalink.bmdManager) {
          let details = {
            guildId: player.guildId,
            voiceChannelId: player.voiceChannelId,
            textChannelId: player.textChannelId,
          }
          await player.destroy()
          let node = getHealthyNode(client)
          if (!node) {
            console.log(`[${this.data.name}] No Healthy Lavalink Nodes Found`)
            return
          }
          player = client.lavalink.createPlayer({
            ...details,
            node,
          })
          await player.connect()
        } else {
          console.log(`[${this.data.name}] Connect Player (Change Node) Is A Option Exclusive To The Lavalink Multi Connection Mod`)
        }
        break
      }

      default: {
        await player[actionType]()
        break
      }
    }
  },
}
