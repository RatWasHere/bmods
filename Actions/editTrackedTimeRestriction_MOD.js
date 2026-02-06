modVersion = "v1.0.0"
const indexByStoreAs = (values, storeAs) => {
  if (typeof storeAs != "string") {
    return console.log("Not String")
  }
  let index = values.UI.findIndex((element) => element.storeAs == storeAs)
  console.log(index)
  if (index == -1) {
    return console.log("Index Not Found")
  }
  return index
}

module.exports = {
  data: {
    name: "Edit Tracked Time Restriction",
  },
  aliases: ["Edit Cooldown", "Remove Cooldown", "Increase Cooldown", "Decrease Cooldown"],
  modules: [],
  category: "Control",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "typedDropdown",
      storeAs: "action",
      name: "Operation",
      choices: {
        increase: { name: "Increase", field: false },
        decrease: { name: "Decrease", field: false },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "time",
      name: "Decrease Cooldown By",
      choices: {
        seconds: { name: "Seconds", field: true, placeholder: "Cooldown In Seconds" },
        minutes: { name: "Minutes", field: true, placeholder: "Cooldown In Minutes" },
        hours: { name: "Hours", field: true, placeholder: "Cooldown In Hours" },
        days: { name: "Days", field: true, placeholder: "Cooldown In Days" },
        all: { name: "Remove Cooldown", field: false },
      },
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "target",
      name: "Target",
      choices: {
        user: { name: "User", field: false },
        member: { name: "Member", field: false },
        channel: { name: "Channel", field: false },
        role: { name: "Role", field: false },
        server: { name: "Server", field: false },
        global: { name: "Global", field: false },
      },
    },
    "_",
    {
      element: "",
      storeAs: "user",
      name: "User To Restrict",
    },
    "_",
    {
      element: "input",
      storeAs: "identifier",
      name: "Restriction Identifier",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let subtitle = `Edit Command Restriction For ${values.target.type} For ${values.time.value} ${values.time.type}`
    const titleCase = (string) =>
      string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    return titleCase(subtitle)
  },

  script: (values) => {
    function reflem(skipAnimation) {
      let targetType = values.data.target.type

      let elementMap = {
        user: {
          element: "user",
          storeAs: "user",
          name: "User To Restrict",
        },
        member: {
          element: "member",
          storeAs: "member",
          name: "Member To Restrict",
        },
        role: {
          element: "role",
          storeAs: "role",
          name: "Role To Restrict",
        },
        server: {
          element: "guild",
          storeAs: "server",
          name: "Server To Restrict",
        },
        channel: {
          element: "channelInput",
          storeAs: "channel",
          name: "Channel To Restrict",
        },
        global: "_",
      }

      values.UI[6] = elementMap[targetType]
      let timeElementIdx = indexByStoreAs(values, "time")

      if (values.data.action.type == "increase") {
        values.UI[timeElementIdx].choices = {
          seconds: { name: "Seconds", field: true, placeholder: "Cooldown In Seconds" },
          minutes: { name: "Minutes", field: true, placeholder: "Cooldown In Minutes" },
          hours: { name: "Hours", field: true, placeholder: "Cooldown In Hours" },
          days: { name: "Days", field: true, placeholder: "Cooldown In Days" },
        }
        values.UI[timeElementIdx].name = "Increase Cooldown By"
      } else if (values.data.action.type == "decrease") {
        values.UI[timeElementIdx].choices = {
          seconds: { name: "Seconds", field: true, placeholder: "Cooldown In Seconds" },
          minutes: { name: "Minutes", field: true, placeholder: "Cooldown In Minutes" },
          hours: { name: "Hours", field: true, placeholder: "Cooldown In Hours" },
          days: { name: "Days", field: true, placeholder: "Cooldown In Days" },
          all: { name: "Remove Cooldown", field: false },
        }
        values.UI[timeElementIdx].name = "Decrease Cooldown By"
      }

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100,
      )
    }

    reflem(true)

    values.events.on("change", () => {
      reflem()
    })
  },

  init: (values, bridge) => {
    const path = require("node:path")
    const fs = require("node:fs")

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc
    } else {
      projectFolder = workingDir
    }

    let restrictionsFilePath = path.join(projectFolder, "aceModsJSON", "restrictions.json")

    if (!fs.existsSync(restrictionsFilePath)) {
      fs.mkdirSync(path.dirname(restrictionsFilePath), { recursive: true })
      fs.writeFileSync(restrictionsFilePath, "{}")
    }

    var cache = JSON.parse(fs.readFileSync(restrictionsFilePath, "utf-8"))

    let getRestrictions = () => {
      return bridge.data.IO.restrictions.cache
    }

    let pendingWrite = false

    let writeRestrictions = (data) => {
      bridge.data.IO.restrictions.cache = JSON.parse(JSON.stringify(data))
      if (pendingWrite == false) {
        pendingWrite = true
        setTimeout(() => {
          try {
            fs.writeFileSync(restrictionsFilePath, JSON.stringify(bridge.data.IO.restrictions.cache, null, 2))
          } catch (err) {
          } finally {
            pendingWrite = false
          }
        }, 500)
      }
    }

    bridge.data.IO.restrictions = {
      get: getRestrictions,
      write: writeRestrictions,
      cache,
    }

    if (!bridge.data.IO.restrictions.intervalSet) {
      bridge.data.IO.restrictions.intervalSet = true
      setInterval(async () => {
        let restrictions = bridge.data.IO.restrictions.get()
        let currentTime = Date.now()
        let updates = false

        for (let restriction in restrictions) {
          let expirationTime = restrictions[restriction].expiresAt
          if (expirationTime < currentTime) {
            delete restrictions[restriction]
            updates = true
          }
        }

        if (updates == true) {
          bridge.data.IO.restrictions.write(restrictions)
        }
      }, 1000)
    }
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
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
    let commandId = bridge.transf(values.identifier)

    if (!commandId || commandId == "") {
      return console.log(`[${this.data.name}] A Identifier Is Needed`)
    }

    let targetId

    switch (targetType) {
      case "user": {
        let user = await bridge.getUser(values.user)
        targetId = user.id
        break
      }

      case "member": {
        let user = await bridge.getUser(values.member)
        targetId = `${user.member.guild.id}${user.id}`
        break
      }

      case "role": {
        let role = await bridge.getRole(values.role)
        targetId = role.id
        break
      }

      case "server": {
        let server = await bridge.getGuild(values.server)
        targetId = server.id
        break
      }

      case "channel": {
        let channel = await bridge.getChannel(values.channel)
        targetId = channel.id
        break
      }

      default: {
        targetId = "GLOBAL"
        break
      }
    }

    let restrictionId = `command-${targetType}${targetId}-${commandId}`

    let restrictionInfo = restrictionData[restrictionId]
    if (!restrictionInfo) {
      return
    }

    let restrictionExpiry = restrictionInfo.expiresAt
    if (values.time.type !== "all") {
      if (values.action.type == "increase") {
        let timeIncrease = Number(timeUnits[values.time.type] * bridge.transf(values.time.value))
        let increasedTime = restrictionExpiry + timeIncrease
        restrictionData[restrictionId].expiresAt = increasedTime
      } else if (values.action.type == "decrease") {
        let timeReduction = Number(timeUnits[values.time.type] * bridge.transf(values.time.value))
        let reducedTime = restrictionExpiry - timeReduction
        if (reducedTime > currentTime) {
          restrictionData[restrictionId].expiresAt = reducedTime
        } else {
          delete restrictionData[restrictionId]
        }
      }
    } else if (values.time.type == "all") {
      if (values.action.type == "decrease") {
        delete restrictionData[restrictionId]
      } else if (values.action.type == "increase") {
        return console.log(`[${this.data.name}] Can't Remove Cooldown If Increasing Duration`)
      }
    }

    bridge.data.IO.restrictions.write(restrictionData)
  },
}
