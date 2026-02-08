modVersion = "v1.1.0"
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
              name: "Port",
              storeAs: "port",
            },
            {
              element: "input",
              name: "Password",
              storeAs: "password",
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
    "_",
    {
      element: "input",
      name: "Retry Bad Node Connection Every # Minutes",
      storeAs: "retryAfterMinutes",
      placeholder: "30",
    },
    "_",
    {
      element: "toggle",
      storeAs: "logging",
      name: "Enable Non-essential Logging",
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

    let nodes = []
    for (let [index, node] of values.nodes.entries()) {
      let nodeData = node.data
      if (!nodeData.password || !nodeData.host || !nodeData.port || !nodeData.nodeName) {
        console.log(`[${this.data.name}] Missing Credentials For Node #${index + 1}`)
        continue
      }
      let host = bridge.transf(nodeData.host)
      let port = Number(bridge.transf(nodeData.port))
      let authorization = bridge.transf(nodeData.password)
      let id = bridge.transf(nodeData.nodeName)
      nodes.push({ host, port, authorization, id })
    }

    const botData = require(`../data.json`)
    const appName = botData.name || `BMD Bot`
    let destroyAfterMs

    if (values.destroyAfterMs) {
      destroyAfterMs = Number(bridge.transf(values.destroyAfterMs))
    }

    async function setupLavalink(client, nodes, appName, modName) {
      client.lavalink = new LavalinkManager({
        nodes,
        autoSkip: true,
        sendToShard: (guildId, payload) => {
          const shardIDs = client.shards.options.shardIDs
          const shardCount = shardIDs.length || 1
          const shardId = Number((BigInt(guildId) >> 22n) % BigInt(shardCount))
          const shard = client.shards.get(shardId)

          if (!shard) {
            console.warn(`[${modName || "Lavalink Multi Connection"}] Shard ${shardId} Not Found For Guild ${guildId}`)
            return
          }

          try {
            shard.ws.send(JSON.stringify(payload))
          } catch (err) {
            console.error(`[${modName || "Lavalink Multi Connection"}] Failed To Send Payload To Shard:`, err)
          }
        },
        client: {
          id: "placeholder",
          username: appName,
        },
        playerOptions: {
          applyVolumeAsFilter: false,
          clientBasedPositionUpdateInterval: 150,
          defaultSearchPlatform: `ytsearch`,
          volumeDecrementer: 0.75,
          onDisconnect: {
            autoReconnect: false,
            destroyPlayer: false,
          },
          onEmptyQueue: {
            destroyAfterMs,
            autoPlayFunction: null,
          },
        },
      })

      client.lavalink.bmdManager = {
        states: {
          active: new Map(),
          bad: new Map(),
        },
        reconnectAttempts: new Map(),
      }

      client.lavalink.nodeManager
        .on("connect", (node) => {
          console.log(`[${modName || "Lavalink Multi Connection"}] Connected To Lavalink Node: ${node.id}`)
          client.lavalink.bmdManager.states.bad.delete(node.id)
          client.lavalink.bmdManager.states.active.set(node.id, node)
          client.lavalink.bmdManager.reconnectAttempts.delete(node.id)
        })
        .on("disconnect", (node, reason) => {
          if (values.logging) {
            console.log(`[${modName || "Lavalink Multi Connection"}] Disconnected From Lavalink Node: ${node.id}, Reason ${JSON.stringify(reason)}`)
          }

          let disconnectReason = reason?.reason?.toLowerCase()
          if (disconnectReason.includes("proxy")) {
            if (values.logging) {
              console.log(
                `[${modName || "Lavalink Multi Connection"}] Lavalink Node ${node.id} Connection Failed Due To Proxy Issues, Attempting Connection At A Later Time`,
              )
            }
            client.lavalink.bmdManager.states.active.delete(node.id)
            client.lavalink.bmdManager.states.bad.set(node.id, {
              node,
              movedAt: Date.now(),
              details: {
                host: node.options.host,
                port: node.options.port,
                authorization: node.options.authorization,
                id: node.id,
              },
            })
            client.lavalink.nodeManager.deleteNode(node)
            return
          }

          let attempts = (client.lavalink.bmdManager.reconnectAttempts.get(node.id) ?? 0) + 1
          client.lavalink.bmdManager.reconnectAttempts.set(node.id, attempts)
          if (attempts <= 3) {
            setTimeout(async () => {
              if (!node.connected) {
                try {
                  if (values.logging) {
                    console.log(`[${modName}] Attempting To Reconnect ${node.id}, Attempt ${attempts}/3`)
                  }
                  await node.connect()
                } catch (err) {
                  if (values.logging) {
                    console.log(`[${modName}] Reconnect ${node.id} Attempt Failed: ${err}`)
                  }
                }
              }
            }, 1000)
            return
          }
          client.lavalink.bmdManager.states.active.delete(node.id)
          client.lavalink.bmdManager.states.bad.set(node.id, {
            node,
            movedAt: Date.now(),
            details: {
              host: node.options.host,
              port: node.options.port,
              authorization: node.options.authorization,
              id: node.id,
            },
          })
          console.log(
            `[${modName || "Lavalink Multi Connection"}] Lavalink Node ${node.id} Connection Failed After ${attempts} Attempts, Attempting Connection At A Later Time`,
          )
          client.lavalink.nodeManager.deleteNode(node)
        })
        .on("error", (node, error) => {
          console.log(`[${modName || "Lavalink Multi Connection"}] Lavalink Node ${node.id} Error: ${error}`)
        })

      client.on("packet", (packet) => {
        if (packet.t === `VOICE_STATE_UPDATE` || packet.t === `VOICE_SERVER_UPDATE`) {
          client.lavalink.sendRawData(packet)
        }
      })

      while (!client.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      console.log(`[${modName || "Lavalink Multi Connection"}] Initializing Lavalink...`)
      client.lavalink.options.client.id = client.user.id

      try {
        client.lavalink.init(client.user)
      } catch (err) {
        console.log(`[${modName || "Lavalink Multi Connection"}] Init Failed: ${err}`)
      }

      let retryInterval = (Number(bridge.transf(values.retryAfterMinutes) || 30) || 30) * 60 * 1000
      setInterval(async () => {
        for (const [id, nodeInfo] of client.lavalink.bmdManager.states.bad) {
          let { node, movedAt, details } = nodeInfo

          if (node.connected || Date.now() - movedAt < retryInterval) continue
          console.log(`[${modName || "Lavalink Multi Connection"}] Retrying Connection To Bad Node: ${id}`)

          try {
            const newNode = client.lavalink.nodeManager.createNode({
              host: details.host,
              port: details.port,
              authorization: details.authorization,
              id: details.id,
            })

            client.lavalink.bmdManager.states.bad.set(id, {
              node: newNode,
              movedAt: Date.now(),
              details,
            })

            await newNode.connect()
          } catch (err) {
            console.warn(`[${modName}] Reconnection To Bad Node Failed: ${id}, ${err}`)
          }
        }
      }, retryInterval)
    }
    let modName = this.data.name
    await setupLavalink(client, nodes, appName, modName)
  },
}
