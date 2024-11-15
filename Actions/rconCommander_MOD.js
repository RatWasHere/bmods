module.exports = {
  data: {
    name: "Extended RCON Commander"
  },
  category: "RCON",
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["rcon"],
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
      name: "Use Challenge Protocol"
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
    const Rcon = require("rcon")

    const config = {
      tcp: bridge.transf(values.tcpudp),
      challenge: bridge.transf(values.challengePtc)
    }

    const ipAddr = bridge.transf(values.ipAddress)
    const ipPort = bridge.transf(values.ipPort)
    const rconPw = bridge.transf(values.rconPassword)
    const rconCm = bridge.transf(values.rconCommand)
    const logging = bridge.transf(values.logging)

    const rconServer = new Rcon(ipAddr, ipPort, rconPw, config)
    rconServer.setTimeout(() => {
      if (logging == true){console.log(`Connection to ${ipAddr}:${ipPort} timed out.`)}
      bridge.store(values.rconResponse, `Connection timed out.`)
      rconServer.disconnect()
    }, 1500)

    rconServer.on("auth", function(){
      if (logging == true){
        console.log(`Connection to ${ipAddr}:${ipPort} established.`)
        console.log(`Sending command: ${rconCm}`)}
      rconServer.send(rconCm)
    })
    
    rconServer.on("response", function(str){
      if (logging == true){console.log("Response received: "+ str)}
      bridge.store(values.rconResponse, str)
      rconServer.disconnect()
      bridge.runner(values.actions)
    })
    
    rconServer.on("end", function(){
      if (logging == true){console.log(`Connection to ${ipAddr}:${ipPort} dropped.`)}
      rconServer.disconnect()
    })
    
    rconServer.on("error", function(str){
      if (logging == true){console.log(`Error: ${str}`)}
      bridge.store(values.rconResponse, `Error: ${str}`)
      rconServer.disconnect()
    })

    rconServer.connect()
  }
}