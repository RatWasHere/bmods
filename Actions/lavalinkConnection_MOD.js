modVersion = "v1.0.0";

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
      element: "text",
      text: modVersion,
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
            destroyAfterMs: 30_000,
            autoPlayFunction: null,
          },
        },
      });

      // Add node connection logging
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

      // This section should also be placed where it runs ONCE during initialization.
      // It's more complex because you need to iterate over shards and re-attach on reconnects.

      async function setupWebSocketListeners(client) {
        // Wait for shards to be ready, or at least for some to exist
        while (!client.shards || client.shards.size === 0) {
          console.log(
            "Shards ain't ready yet. Waiting to hijack the WebSocket..."
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        }

        client.shards.forEach((shard) => {
          // Only attach if not already attached, because these Websockets can be recreated
          if (!shard._LavalinkWsListenerAdded) {
            shard.ws.on("message", (rawDataFromWs) => {
              try {
                let rawData = rawDataFromWs; // Now rawDataFromWs is directly our data

                // If it's a Buffer (binary data), convert it to a string.
                // Discord gateway JSON is always text, so this is a safeguard.
                if (rawData instanceof Buffer) {
                  rawData = rawData.toString("utf8");
                }

                // If it's still not a string, or it's empty, or it's not defined,
                // then this message is useless or malformed. Just ignore it.
                if (typeof rawData !== "string" || !rawData.trim()) {
                  return;
                }

                const payload = JSON.parse(rawData);

                // Send the parsed payload to lavalink-client
                client.lavalink.sendRawData(payload);
              } catch (e) {
                console.error("Error parsing WebSocket message:", e);
              }
            });
            shard._LavalinkWsListenerAdded = true;
          }
        });

        // You might also need to re-run this function if shards reconnect or new ones are added
        // (e.g., if BMD has an event for shard ready/reconnect)
      }

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

      initLavalinkWithRetry(client).then(() => {
        setupWebSocketListeners(client);
      });
    });
  },
};
