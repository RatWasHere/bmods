modVersion = "v1.3.0"
module.exports = {
  data: {
    name: "RCON MultiCommander",
    timeout: "1.5",
  },
  aliases: ["Send Multiple RCON Commands"],
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "RCON",
  modules: ["mbr-rcon", "p-limit"],
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
      placeholder: "This will only show in BMD",
    },
    "-",
    {
      element: "menu",
      storeAs: "serverList",
      name: "Server",
      types: { servers: "servers" },
      max: 50,
      UItypes: {
        servers: {
          data: {},
          name: "Server:",
          preview: "`${option.data.ipAddress}:${option.data.ipPort} | Command: ${option.data.rconCommand}`",
          UI: [
            {
              element: "input",
              storeAs: "ipAddress",
              name: "RCON Server IP Address",
            },
            {
              element: "input",
              storeAs: "ipPort",
              name: "RCON Server Port",
            },
            {
              element: "input",
              storeAs: "rconPassword",
              name: "RCON Server Password",
            },
            {
              element: "input",
              storeAs: "timeout",
              name: "Timeout After",
              placeholder: "In Seconds, Defaults To 5s",
            },
            {
              element: "largeInput",
              storeAs: "rconCommand",
              name: "RCON Command",
            },
            "-",
            {
              element: "store",
              storeAs: "rconResponse",
              name: "Store Command Response As",
            },
            "_",
            {
              element: "actions",
              storeAs: "actions",
              name: "On Response, Run",
            },
            "_",
            {
              element: "toggle",
              storeAs: "logging",
              name: "Log To Console For Debugging?",
              true: "Yes",
              false: "No",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) => {
    return `${values.label} | Send ${values.serverList.length} RCON commands to ${values.serverList.length} servers.`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }
    const Rcon = require("mbr-rcon")
    const pLimitImport = require("p-limit")
    const pLimit = pLimitImport.default || pLimitImport
    const concurrentLimit = pLimit(5)
    const modName = this.data.name

    let rconPromises = values.serverList.map((server) => {
      return concurrentLimit(() => {
        const timeout = bridge.transf(server.data.timeout) ? Number(bridge.transf(server.data.timeout)) * 1000 : 5000

        const logging = server.data.logging
        let rconServer

        return Promise.race([
          new Promise((resolve, reject) => {
            const ipAddr = bridge.transf(server.data.ipAddress)
            const ipPort = bridge.transf(server.data.ipPort)
            const rconPw = bridge.transf(server.data.rconPassword)
            const rconCm = bridge.transf(server.data.rconCommand)

            const config = {
              host: ipAddr,
              port: ipPort,
              pass: rconPw,
            }

            const rcon = new Rcon(config)

            rconServer = rcon
              .connect({
                onSuccess: () => {
                  if (logging) {
                    console.log(`[${modName}] Connected ${ipAddr}:${ipPort}`)
                  }
                },
                onError: (error) => {
                  if (logging) {
                    console.log(`[${modName}] Connection error: ${error}`)
                  }
                  bridge.store(server.data.rconResponse, `Connection Error: Server Offline.`)
                  reject(error)
                },
              })
              .auth({
                onSuccess: () => {
                  if (logging) {
                    console.log(`[${modName}] Authenticated`)
                  }
                },
                onError: (error) => {
                  if (logging) {
                    console.log(`[${modName}] Auth error: ${error}`)
                  }
                  bridge.store(server.data.rconResponse, `Authentication Error: Wrong Password.`)
                  reject(error)
                },
              })
              .send(rconCm, {
                onSuccess: (response) => {
                  if (logging) {
                    console.log(`[${modName}] Response: ${response}`)
                  }
                  rconServer.close()
                  bridge.store(server.data.rconResponse, response)
                  bridge.runner(server.data.actions)
                  resolve(response)
                },
                onError: (error) => {
                  if (logging) {
                    console.log(`[${modName}] Command error: ${error}`)
                  }
                  bridge.store(server.data.rconResponse, `Command Error: Execution Error.`)
                  reject(error)
                },
              })
          }),

          new Promise((_, reject) =>
            setTimeout(() => {
              if (rconServer) {
                try {
                  rconServer.close()
                } catch {}
              }
              reject(new Error(`Server Took Too Long!`))
            }, timeout),
          ),
        ]).catch((error) => {
          if (logging) {
            console.log(`[${modName}] Error: ${error}`)
          }
          bridge.store(server.data.rconResponse, `RCON Error: ${error.message}`)
        })
      })
    })

    await Promise.allSettled(rconPromises)
  },
}
