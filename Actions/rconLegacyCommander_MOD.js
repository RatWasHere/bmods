module.exports = {
  data:{
    name: "RCON Commander"
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
  ],

  subtitle: (values) => {
    return `Send command: ${values.rconCommand} to ${values.ipAddress}:${values.ipPort}`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge){
    const Rcon = require("mbr-rcon")

    await new Promise((resolve, reject) => {
      const ipAddr = bridge.transf(values.ipAddress)
      const ipPort = bridge.transf(values.ipPort)
      const rconPw = bridge.transf(values.rconPassword)
      const rconCm = bridge.transf(values.rconCommand)
      const logging =bridge.transf(values.logging)

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
          bridge.store(values.rconResponse, `Connection Error: Server Offline.`)
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
          bridge.store(values.rconResponse, `Authentication Error: Wrong Password.`)
          reject(error)
        }
      }).send(rconCm, {
        onSuccess: (response) => {
          if (logging == true){console.log(`Server response: ${response}`)}
          rconServer.close()
          bridge.store(values.rconResponse, response)
          bridge.runner(values.actions)
          resolve(response)
        },
        onError: (error) => {
          if (logging == true){console.log(`Command error: ${error}`)}
          bridge.store(values.rconResponse, `Command Error: Execution Error`)
          reject(error)
        }
      })
    })

  }
}