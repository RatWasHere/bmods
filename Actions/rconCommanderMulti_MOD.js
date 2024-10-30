module.exports = {
  data: {
    name: "RCON MultiCommander"
  },
  category: "RCON",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["rcon"],
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
      placeholder: "This will only show in BMD"
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
            }
          ]
        }
      }
    }
  ],

  subtitle: (values) => {
    return `${values.label} | Send ${values.rconList.length} RCON commands to ${values.rconList.length} servers`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge){
    const Rcon = require("rcon")

    for (let rconDetails of values.rconList){
      await new Promise((resolve, reject) => {

        const config = {
          tcp: bridge.transf(rconDetails.data.tcpudp),
          challenge: bridge.transf(rconDetails.data.challengePtc)
        }

        const ipAddr = bridge.transf(rconDetails.data.ipAddress)
        const ipPort = bridge.transf(rconDetails.data.ipPort)
        const rconPw = bridge.transf(rconDetails.data.rconPassword)
        const rconCm = bridge.transf(rconDetails.data.rconCommand)

        const rconServer = new Rcon(ipAddr, ipPort, rconPw, config)
        rconServer.connect()
        
        rconServer.on("auth", function(){
          console.log(`Connection to ${ipAddr}:${ipPort} established\n`)
          console.log(`Sending command: ${rconCm}\n`)
          rconServer.send(rconCm)
        })
        
        rconServer.on("response", function(str){
          console.log("Response received: "+ str +"\n")
          rconServer.disconnect()
          bridge.store(rconDetails.data.rconResponse, str)
          bridge.runner(rconDetails.data.actions)
          resolve()
        })
        
        rconServer.on("end", function(){
          console.log(`Connection to ${ipAddr}:${ipPort} dropped.\n`)
          rconServer.disconnect()
          resolve()
        })
        
        rconServer.on("error", function(str){
          console.log(`Error: ${str}\n`)
          rconServer.disconnect()
          reject()
        })
      })
    }
  }
}