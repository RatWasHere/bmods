modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Lavalink Player Info v2",
  },
  aliases: [],
  modules: ["lavalink-client"],
  category: "Lavalink Music",
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
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
      storeAs: "info",
      name: "Info",
      choices: {
        exists: { name: "Exists" },
        guildId: { name: "Guild Id" },
        voiceChannelId: { name: "Voice Channel Id" },
        textChannelId: { name: "Text Channel Id" },
        playing: { name: "Is Playing?" },
        paused: { name: "Is Paused?" },
        repeatMode: { name: "Repeat Mode" },
        volume: { name: "Volume" },
        node: { name: "Node Object" },
        nodeName: { name: "Node Id" },
      },
    },
    "_",
    {
      element: "store",
      storeAs: "store",
      name: "Store As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    const getOptionName = (values, storeAs, thisAction) => {
      if (typeof storeAs != "string") {
        return console.log("Not String")
      }
      return thisAction.UI.find((el) => el.storeAs == storeAs && el.element == "typedDropdown").choices[values[storeAs]?.type].name
    }

    return `Get Lavalink Player Info - ${getOptionName(values, "info", thisAction)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let player
    let output

    if (values.player?.value !== "") {
      try {
        player = bridge.get(values.player)
      } catch {}
    }

    if (!player) {
      player = client.lavalink.getPlayer(bridge.guild.id)
    }

    let infoType = bridge.transf(values.info.type)
    switch (infoType) {
      case "exists": {
        output = !!player
        break
      }

      case "nodeName": {
        output = player?.node?.id
        break
      }

      default: {
        output = player ? player[infoType] : undefined
        break
      }
    }

    bridge.store(values.store, output)
  },
}
