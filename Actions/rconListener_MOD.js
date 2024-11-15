module.exports = {
  data: {
    name: "RCON Listener",
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
      element: "toggle",
      storeAs: "maintain",
      name: "Maintain Connection",
    },
    {
      element: "store",
      storeAs: "serverMessage",
      name: "Store RCON Server Message As",
    },
    {
      element: "actions",
      storeAs: "toRunAct",
      name: "Run actions",
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
    return `Listen to ${values.ipAddress}:${values.ipPort}, maintained: ${values.maintain}`
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
    const logging = bridge.transf(values.logging)

    const rconServer = new Rcon(ipAddr, ipPort, rconPw, config)

    rconServer.on("auth", function(){
      if (logging == true){console.log(`Connection made with ${ipAddr}:${ipPort}, authentication success.`)}
    })
    
    rconServer.on("error", function(err){
      if (logging == true){console.log(`Error: ${err}`)}
      bridge.store(values.serverMessage, `Error: ${err}`)
      if (bridge.transf(values.maintain) == true){
        if (logging == true){console.log(`Connection with ${ipAddr}:${ipPort} dropped, attempting reconnecting.`)}
        rconServer.connect()
      } else if (bridge.transf(values.maintain) == false){
        if (logging == true){console.log(`Connection with ${ipAddr}:${ipPort} dropped.`)}
        rconServer.disconnect()
      }
    })
    
    rconServer.on("end", function(){
      if (bridge.transf(values.maintain) == true){
        if (logging == true){console.log(`Connection with ${ipAddr}:${ipPort} dropped, attempting reconnecting.`)}
        rconServer.connect()
      } else if (bridge.transf(values.maintain) == false){
        if (logging == true){console.log(`Connection with ${ipAddr}:${ipPort} dropped.`)}
        rconServer.disconnect()
      }
    })
    
    rconServer.on("response", function (str) {
      if (logging == true){console.log(str)}
      bridge.store(values.serverMessage, str)
      bridge.runner(values.toRunAct)
    })
    
    rconServer.on("server", function (str) {
      if (logging == true){console.log(str)}
      bridge.store(values.serverMessage, str)
      bridge.runner(values.toRunAct)
    })

    rconServer.connect()
  }
}