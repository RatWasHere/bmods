module.exports = {
  modules: ["lavalink-client"],
  data: {
    name: "Lavalink Connection",
  },
  category: "Lavalink Music",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
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
      placeholder: "The name of your lavalink server",
    },
    "-",
    {
      element: "input",
      name: "Destroy Player Milliseconds",
      storeAs: "destroyAfterMs",
      placeholder: "Leave empty to not leave voice channel when queue ends",
    },
  ],
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const { LavalinkManager } = await client
      .getMods()
      .require("lavalink-client");

    return new Promise((resolve, reject) => {
      // Check for missing required fields
      if (
        !values.host ||
        !values.password ||
        !values.port ||
        !values.nodeName
      ) {
        return reject(
          new Error("Missing required fields in lavalink connection.")
        );
      }

      const botData = require("../data.json");
      const appName = botData.name || "BMD Bot";
      let destroyAfterMs;

      if (values.destroyAfterMs) {
        destroyAfterMs = Number(bridge.transf(values.destroyAfterMs));
      }

      client.lavalink = new LavalinkManager({
        nodes: [
          {
            authorization: bridge.transf(values.password),
            host: bridge.transf(values.host),
            port: Number(bridge.transf(values.port)),
            id: bridge.transf(values.nodeName),
          },
        ],
        sendToShard: (guildId, payload) => {
          const shardIDs = client.shards.options.shardIDs;
          const shardCount = shardIDs.length || 1;
          const shardId = Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
          const shard = client.shards.get(shardId);

          if (!shard) {
            console.warn(`Shard ${shardId} not found for guild ${guildId}`);
            return;
          }

          try {
            shard.ws.send(JSON.stringify(payload));
          } catch (err) {
            console.error("Failed to send payload to shard:", err);
          }
        },
        autoSkip: true,
        client: {
          id: "PLACEHOLDER", // Will be updated when ready
          username: appName,
        },
        playerOptions: {
          applyVolumeAsFilter: false,
          clientBasedPositionUpdateInterval: 150,
          defaultSearchPlatform: "ytsearch",
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
      });

      client.lavalink.nodeManager
        .on("connect", (node) => {
          console.log(`Connected to Lavalink node: ${node.id}`);
        })
        .on("disconnect", (node, reason) => {
          console.warn(
            `Disconnected from Lavalink node: ${node.id}, Reason: ${reason}`
          );
        })
        .on("error", (node, error) => {
          console.error(`Lavalink node ${node.id} error:`, error);
        })
        .on("reconnecting", (node) => {
          console.warn(`Reconnecting to Lavalink node: ${node.id}`);
        });

      client.on("packet", (packet) => {
        if (
          packet.t === "VOICE_STATE_UPDATE" ||
          packet.t === "VOICE_SERVER_UPDATE"
        ) {
          client.lavalink.sendRawData(packet);
        }
      });

      function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function initLavalinkWithRetry(client) {
        while (!client.ready) {
          console.log("Client not ready, retrying in 5s...");
          await wait(5000);
        }

        console.log("Initializing Lavalink...");
        client.lavalink.options.client.id = client.user.id;
        client.lavalink.init(client.user);
      }

      initLavalinkWithRetry(client);
    });
  },
};
