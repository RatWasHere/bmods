modVersion = "v1.0.0"

module.exports = {
  data: {
    name: "Set Tracked Time Restriction"
  },
  aliases: [],
  modules: [],
  category: "Control",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "typedDropdown",
      storeAs: "time",
      name: "Restriction Cooldown",
      choices: {
        seconds: {name: "Seconds", field: true, placeholder: "Cooldown In Seconds"},
        minutes: {name: "Minutes", field: true, placeholder: "Cooldown In Minutes"},
        hours: {name: "Hours", field: true, placeholder: "Cooldown In Hours"},
        days: {name: "Days", field: true, placeholder: "Cooldown In Days"},
      },
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "target",
      name: "Target",
      choices: {
        user: {name: "User", field: false},
        member: {name: "Member", field: false},
        role: {name: "Role", field: false},
        server: {name: "Server", field: false},
        global: {name: "Global", field: false},
      },
    },
    "_",
    {
      element: "user",
      storeAs: "user",
      name: "User To Restrict",
    },
    {
      element: "user",
      storeAs: "member",
      name: "Member To Restrict",
    },
    {
      element: "role",
      storeAs: "role",
      name: "Role To Restrict",
    },
    {
      element: "guild",
      storeAs: "server",
      name: "Server To Restrict",
    },
    "-",
    {
      element: "store",
      storeAs: "timeTillExpiry",
      name: "If Ongoing, Store Remaining Time In Milliseconds As"
    },
    {
      element: "case",
      name: "If Time Restriction Is Ongoing",
      storeAs: "ifOngoing",
      storeActionsAs: "ifOngoingActions",
    },
    {
      element: "case",
      name: "If Time Restriction Is Not Ongoing",
      storeAs: "ifNotOngoing",
      storeActionsAs: "ifNotOngoingActions"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    let subtitle = `Restrict Command For ${values.target.type} For ${values.time.value} ${values.time.type}`
    const titleCase = string => string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    return titleCase(subtitle)
  },

  script: (values) =>{
    function reflem(skipAnimation){
      let targetType = values.data.target.type

      switch (targetType){
        case "user": {
          values.UI[4].element = "user"
          values.UI[5].element = ""
          values.UI[6].element = ""
          values.UI[7].element = ""
          break
        }

        case "member": {
          values.UI[4].element = ""
          values.UI[5].element = "member"
          values.UI[6].element = ""
          values.UI[7].element = ""
          break
        }

        case "role": {
          values.UI[4].element = ""
          values.UI[5].element = ""
          values.UI[6].element = "role"
          values.UI[7].element = ""
          break
        }

        case "server": {
          values.UI[4].element = ""
          values.UI[5].element = ""
          values.UI[6].element = ""
          values.UI[7].element = "guild"
          break
        }

        case "global": {
          values.UI[4].element = ""
          values.UI[5].element = ""
          values.UI[6].element = ""
          values.UI[7].element = ""
          break
        }
      }

      setTimeout(()=>{
        values.updateUI()
      }, skipAnimation?1: values.commonAnimation*100)
    }

    reflem(true)

    values.events.on("change", ()=>{
      reflem()
    })
  },

  startup: (bridge) =>{
    const altPath = require("node:path")
    const altFs = require("node:fs")

    const botData = require("../data.json");
    const workingDir = altPath.normalize(process.cwd());
    let projectFolder;
    if (workingDir.includes(altPath.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc;
    } else {
      projectFolder = workingDir;
    }

    let restrictionsFilePath = altPath.join(projectFolder, "aceModsJSON", "restrictions.json")

    if (!altFs.existsSync(restrictionsFilePath)){
      altFs.mkdirSync(altPath.dirname(restrictionsFilePath), {recursive: true})
      altFs.writeFileSync(restrictionsFilePath, "{}")
    }

    var cache = JSON.parse(altFs.readFileSync(restrictionsFilePath, "utf-8"))

    let getRestrictions = () => {
      return bridge.data.IO.restrictions.cache
    }

    let writeRestrictions = (data) => {
      bridge.data.IO.restrictions.cache = JSON.parse(JSON.stringify(data))
      altFs.writeFileSync(restrictionsFilePath, JSON.stringify(data, null, 2))
    }

    bridge.data.IO.restrictions = {
      get: getRestrictions,
      write: writeRestrictions,
      cache
    }
  },

  init: (values, bridge) =>{
    if (!bridge.data.IO.restrictions.intervalSet){
      bridge.data.IO.restrictions.intervalSet = true
      setInterval(async ()=>{
        let restrictions = bridge.data.IO.restrictions.get()
        let currentTime = Date.now()
        let updates = false

        for (let restriction in restrictions){
          let expirationTime = restrictions[restriction].expiresAt
          if (expirationTime < currentTime){
            delete restrictions[restriction]
            updates = true
          }
        }

        if (updates == true){
          bridge.data.IO.restrictions.write(restrictions)
        }
      }, 1000)
    }
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    let timeUnits = {
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
      days: 1000 * 60 * 60 * 24,
    }
    
    let restrictionData = bridge.data.IO.restrictions.get() || {}
    let currentTime = Date.now()
    let targetType = values.target.type
    let commandId = bridge.data.commandID

    let targetId

    switch(targetType){
      case "user":{
        let user = await bridge.getUser(values.user)
        targetId = user.id
        break
      }

      case "member":{
        let user = await bridge.getUser(values.member)
        targetId = `${user.member.guild.id}${user.id}`
        break
      }

      case "role":{
        let role = await bridge.getRole(values.role)
        targetId = role.id
        break
      }

      case "server":{
        let server = await bridge.getGuild(values.server)
        targetId = server.id
        break
      }

      default:{
        targetId = "GLOBAL"
        break
      }
    }

    let restrictionId = `${targetType}${targetId}-${commandId}`

    async function notOngoing(){
      let expireTimestamp = Number(currentTime) + Number(timeUnits[values.time.type] * bridge.transf(values.time.value))
      restrictionData[restrictionId] = {
        expiresAt: expireTimestamp
      }
      bridge.data.IO.restrictions.write(restrictionData)
      await bridge.call(values.ifNotOngoing, values.ifNotOngoingActions)
    }

    if (restrictionData[restrictionId]){
      let timeTillExpiry = Number(restrictionData[restrictionId].expiresAt) - Number(currentTime)
      if (timeTillExpiry > 0){
        bridge.store(values.timeTillExpiry, timeTillExpiry)
        await bridge.call(values.ifOngoing, values.ifOngoingActions)
      } else {
        notOngoing()
      }
    } else {
      notOngoing()
    }
  }
}