module.exports = {
  data:{
    name: "RCON MultiCommander"
  },
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "RCON",
  modules: ["mbr-rcon"],
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
      types: {servers: "servers"},
      max: 50,
      UItypes: {
        servers:{
          data:{},
          name: "Server:",
          preview: "`${option.data.ipAddress}:${option.data.ipPort} | Command: ${option.data.rconCommand}`",
          UI:[
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
            {
              element: "actions",
              storeAs: "actions",
              name: "On Response, Run"
            },
            {
              element: "toggle",
              storeAs: "logging",
              name: "Log To Console For Debugging?",
              true: "Yes",
              false: "No"
            },
          ]
        }
      }
    }
  ],

  subtitle: (values) => {
    return `${values.label} | Send ${values.serverList.length} RCON commands to ${values.serverList.length} servers.`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge){
    const Rcon = require("mbr-rcon")

    for (let server of values.serverList){
      await new Promise((resolve, reject) => {
        const ipAddr = bridge.transf(server.data.ipAddress)
        const ipPort = bridge.transf(server.data.ipPort)
        const rconPw = bridge.transf(server.data.rconPassword)
        const rconCm = bridge.transf(server.data.rconCommand)
        const logging = bridge.transf(server.data.logging)

        const config = {
          host: ipAddr,
          port: ipPort,
          pass: rconPw,
        }
        
        const rcon = new Rcon(config)

        const rconServer = rcon.connect({
          onSuccess: () => {
            if (logging == true){console.log(`Connection to ${ipAddr}:${ipPort} established.`)}
          },
          onError: (error) => {
            if (logging == true){console.log(`Connection error: ${error}`)}
            bridge.store(server.data.rconResponse, `Connection Error: Server Offline.`)
            reject(error)
          }
        }).auth({
          onSuccess: () => {
            if (logging == true){
              console.log(`Authenticated.`)
              console.log(`Sending command: ${rconCm}`)
            }
          },
          onError: (error) => {
            if (logging == true){console.log(`Authentication error: ${error}`)}
            bridge.store(server.data.rconResponse, `Authentication Error: Wrong Password.`)
            reject(error)
          }
        }).send(rconCm, {
          onSuccess: (response) => {
            if (logging == true){console.log(`Server response: ${response}`)}
            rconServer.close()
            bridge.store(server.data.rconResponse, response)
            bridge.runner(server.data.actions)
            resolve(response)
          },
          onError: (error) => {
            if (logging == true){console.log(`Command error: ${error}`)}
            bridge.store(server.data.rconResponse, `Command Error: Execution Error`)
            reject(error)
          }
        })
      })
    }
  }
}