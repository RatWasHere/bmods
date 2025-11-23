modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Get Channel Threads",
  },
  aliases: [],
  modules: [],
  category: "Channels",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      name: "Channel",
    },
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        active: { name: "Active Threads", field: false },
        publicArchived: { name: "Public Archived Threads", field: false },
        privateArchived: { name: "Private Archived Threads", field: false },
        all: { name: "All Threads", field: false },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Thread List As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let keyword
    switch (values.get.type) {
      case "active": {
        keyword = "Active"
        break
      }

      case "publicArchived": {
        keyword = "Public Archived"
        break
      }

      case "privateArchived": {
        keyword = "Private Archived"
        break
      }

      case "all": {
        keyword = "All"
        break
      }
    }

    return `Get ${keyword} Threads Of ${constants.channel(values.channel)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let channel = await bridge.getChannel(values.channel)

    let getType = bridge.transf(values.get.type)
    let threads
    switch (getType) {
      case "active": {
        let active = await client.rest.guilds.getActiveThreads(channel.guildID)
        threads = active.threads.filter((thread) => thread.parentID == channel.id)
        break
      }

      case "publicArchived": {
        let archived = await client.rest.channels.getPublicArchivedThreads(channel.id)
        threads = archived.threads
        break
      }

      case "privateArchived": {
        let archived = await client.rest.channels.getPrivateArchivedThreads(channel.id)
        threads = archived.threads
        break
      }

      case "all": {
        let active = await client.rest.guilds.getActiveThreads(channel.guildID)
        let filteredActive = active.threads.filter((thread) => thread.parentID == channel.id)

        let archivedPublic = await client.rest.channels.getPublicArchivedThreads(channel.id)
        let archivedPrivate = await client.rest.channels.getPrivateArchivedThreads(channel.id)

        threads = [...filteredActive, ...archivedPublic.threads, ...archivedPrivate.threads]
        break
      }
    }

    bridge.store(values.store, threads)
  },
}
