modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "MongoDB Connect",
  },
  aliases: ["Connect To MongoDB"],
  modules: ["mongodb"],
  category: "MongoDB",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "mongoURL",
      name: "MongoDB URI",
    },
    {
      element: "input",
      storeAs: "retry",
      name: "Max Retries",
    },
    "-",
    {
      element: "input",
      storeAs: "appName",
      name: "App Name (For Logging, Optional)",
    },
    {
      element: "input",
      storeAs: "poolSize",
      name: "Pool Size (Max 100)",
    },
    "-",
    {
      element: "store",
      storeAs: "mongoClient",
      name: "Store Connection As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Connect To MongoDB`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const mongodb = require("mongodb")
    if (!values.mongoURL) {
      return console.log(`[${this.data.name}] Missing MongoDB URL`)
    }
    let mongoURL = bridge.transf(values.mongoURL).trim()
    let maxRetries = Number(bridge.transf(values.retry)) || 1

    let appName = bridge.transf(values.appName).trim() || undefined
    let maxPoolSize = Math.abs(Number(bridge.transf(values.poolSize))) || 20
    if (maxPoolSize > 100) {
      maxPoolSize = 100
    }

    let mongoClient

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        mongoClient = new mongodb.MongoClient(mongoURL, { appName, maxPoolSize })
        await mongoClient.connect()
        bridge.store(values.mongoClient, mongoClient)
        console.log(`[${this.data.name}] Connected To MongoDB Successfully`)
        return true
      } catch (err) {
        console.log(`[${this.data.name}] (${attempt}) Error Connecting To MongoDB; ${err.message}`)

        if (mongoClient) {
          try {
            await mongoClient.close()
          } catch {}
        }
        await new Promise((r) => setTimeout(r, 2000))
      }
    }

    throw new Error(`[${this.data.name}] Failed To Connect To MongoDB After ${maxRetries} Attempts`)
  },
}
