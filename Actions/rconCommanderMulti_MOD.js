modVersion = "v1.3.0"
module.exports = {
  data: {
    name: "Extended RCON MultiCommander",
  },
  aliases: ["Send Multiple RCON Commands v2"],
  category: "RCON",
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["rcon", "p-limit"],
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
      storeAs: "rconList",
      name: "RCON List",
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
              element: "toggle",
              storeAs: "tcpudp",
              name: "TCP / UDP",
              true: "TCP",
              false: "UDP",
            },
            {
              element: "toggle",
              storeAs: "challengePtc",
              name: "Use Challenge Protocol",
            },
            "-",
            {
              element: "largeInput",
              storeAs: "rconCommand",
              name: "RCON Command",
            },
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
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) => {
    return `${values.label} | Send ${values.rconList.length} RCON commands to ${values.rconList.length} servers`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }
    const Rcon = require("rcon")
    const pLimitImport = require("p-limit")
    const pLimit = pLimitImport.default || pLimitImport
    const concurrentLimit = pLimit(5)
    const modName = this.data.name

    let rconPromises = values.rconList.map((rconDetails) => {
      return concurrentLimit(() => {
        return new Promise((resolve, reject) => {
          const config = {
            tcp: bridge.transf(rconDetails.data.tcpudp),
            challenge: bridge.transf(rconDetails.data.challengePtc),
          }

          const ipAddr = bridge.transf(rconDetails.data.ipAddress)
          const ipPort = bridge.transf(rconDetails.data.ipPort)
          const rconPw = bridge.transf(rconDetails.data.rconPassword)
          const rconCm = bridge.transf(rconDetails.data.rconCommand)
          const logging = rconDetails.data.logging

          const rconServer = new Rcon(ipAddr, ipPort, rconPw, config)
          rconServer.setTimeout(() => {
            if (logging == true) {
              console.log(`[${modName}] Connection to ${ipAddr}:${ipPort} timed out.`)
            }
            bridge.store(rconDetails.data.rconResponse, `Connection timed out.`)
            rconServer.disconnect()
            reject()
          }, 1500)

          rconServer.on("auth", function () {
            if (logging == true) {
              console.log(`[${modName}] Connection to ${ipAddr}:${ipPort} established.`)
              console.log(`[${modName}] Sending command: ${rconCm}`)
            }
            rconServer.send(rconCm)
          })

          rconServer.on("response", function (str) {
            if (logging == true) {
              console.log(`[${modName}] Response received: ` + str)
            }
            bridge.store(rconDetails.data.rconResponse, str)
            rconServer.disconnect()
            bridge.runner(rconDetails.data.actions)
            resolve()
          })

          rconServer.on("end", function () {
            if (logging == true) {
              console.log(`[${modName}] Connection to ${ipAddr}:${ipPort} dropped.`)
            }
            rconServer.disconnect()
            resolve()
          })

          rconServer.on("error", function (str) {
            if (logging == true) {
              console.log(`[${modName}] Error: ${str}`)
            }
            bridge.store(rconDetails.data.rconResponse, `Error: ${str}`)
            rconServer.disconnect()
            reject()
          })

          rconServer.connect()
        })
      })
    })

    await Promise.allSettled(rconPromises)
  },
}
