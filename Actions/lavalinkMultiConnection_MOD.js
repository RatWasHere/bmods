modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Lavalink Multi Connection",
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
      element: "menu",
      storeAs: "nodes",
      name: "Nodes",
      types: { node: "node" },
      max: 50,
      UItypes: {
        node: {
          data: {},
          name: "Node",
          preview: "`${option.data.host||''}:${option.data.port||''} (${option.data.nodeName||''})`",
          UI: [
            {
              element: "input",
              name: "Host",
              storeAs: "host",
            },
            {
              element: "input",
              name: "Password",
              storeAs: "password",
            },
            {
              element: "input",
              name: "Port",
              storeAs: "port",
              placeholder: "Default: 2333",
            },
            {
              element: "input",
              name: "Node Name",
              storeAs: "nodeName",
              placeholder: "The Name Of Your Lavalink Server",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "input",
      name: "Destroy Player Milliseconds",
      storeAs: "destroyAfterMs",
      placeholder: "Leave Empty To Not Leave Voice Channel When Queue Ends",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Attempt Connection To ${values.nodes.length} Lavalink Servers`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const { LavalinkManager } = await client.getMods().require("lavalink-client")

    return new Promise((resolve, reject) => {
      let nodes = []
      for (let [index, node] of values.nodes.entries()) {
        let nodeData = node.data
        if (!nodeData.password || !nodeData.host || !nodeData.port || !nodeData.nodeName) {
          console.log(`[${this.data.name}] Missing Credentials For Node #${index + 1}`)
          continue
        }
        let authorization = bridge.transf(nodeData.password)
        let host = bridge.transf(nodeData.host)
        let port = Number(bridge.transf(nodeData.port))
        let id = bridge.transf(nodeData.nodeName)
        nodes.push({ authorization, host, port, id })
      }

      if (nodes.length < 1) {
        return reject(new Error(`[${this.data.name}] No Valid Node Credentials`))
      }

      const botData = require(`../data.json`)
      const appName = botData.name || `BMD Bot`
      let destroyAfterMs

      if (values.destroyAfterMs) {
        destroyAfterMs = Number(bridge.transf(values.destroyAfterMs))
      }

      client.lavalink = new LavalinkManager({
        nodes,
        sendToShard: (guildId, payload) => {
          const shardIDs = client.shards.options.shardIDs
          const shardCount = shardIDs.length || 1
          const shardId = Number((BigInt(guildId) >> 22n) % BigInt(shardCount))
          const shard = client.shards.get(shardId)

          if (!shard) {
            console.warn(`[${this.data.name}] Shard ${shardId} Not Found For Guild ${guildId}`)
            return
          }

          try {
            shard.ws.send(JSON.stringify(payload))
          } catch (err) {
            console.error(`[${this.data.name}] Failed To Send Payload To Shard:`, err)
          }
        },
        autoSkip: true,
        client: {
          id: `PLACEHOLDER`, // Will be updated when ready
          username: appName,
        },
        playerOptions: {
          applyVolumeAsFilter: false,
          clientBasedPositionUpdateInterval: 150,
          defaultSearchPlatform: `ytsearch`,
          volumeDecrementer: 0.75,
          onDisconnect: {
            autoReconnect: true,
            destroyPlayer: false,
          },
          onEmptyQueue: {
            destroyAfterMs,
            autoPlayFunction: null,
          },
        },
      })

      client.lavalink.nodeManager
        .on(`connect`, (node) => {
          console.log(`[${this.data.name}] Connected To Lavalink Node: ${node.id}`)
        })
        .on(`disconnect`, (node, reason) => {
          console.log(`[${this.data.name}] Disconnected From Lavalink Node: ${node.id}, Reason: ${JSON.stringify(reason)}`)
        })
        .on(`error`, (node, error) => {
          console.log(`[${this.data.name}] Lavalink Node ${node.id} Error: ${error}`)
        })
        .on(`reconnecting`, (node) => {
          console.log(`[${this.data.name}] Reconnecting To Lavalink Node: ${node.id}`)
        })
        .on(`reconnectinprogress`, (node) => {
          console.log(`[${this.data.name}] Attemping Reconnection To Lavalink Node: ${node.id}`)
        })

      client.on(`packet`, (packet) => {
        if (packet.t === `VOICE_STATE_UPDATE` || packet.t === `VOICE_SERVER_UPDATE`) {
          client.lavalink.sendRawData(packet)
        }
      })

      function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }

      async function initLavalinkWithRetry(client) {
        while (!client.ready) {
          console.log(`[Lavalink Multi Connection] Client Not Ready, Retrying In 5s...`)
          await wait(5000)
        }

        console.log(`[Lavalink Multi Connection] Initializing Lavalink...`)
        client.lavalink.options.client.id = client.user.id
        client.lavalink.init(client.user)
      }

      initLavalinkWithRetry(client)
    })
  },
}
