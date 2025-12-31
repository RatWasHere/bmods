modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "dotenv",
    dotenvPath: ".env",
  },
  aliases: [],
  modules: ["dotenv"],
  category: "dotenv",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "dotenvPath",
      name: ".env File Path",
    },
    "_",
    {
      element: "text",
      text: "Access Environmental Variables With ${dotenv.xyz}",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  init: (data, bridge) => {
    const path = require("node:path")
    const fs = require("node:fs")
    const dotenv = require("dotenv")

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc
    } else {
      projectFolder = workingDir
    }
    let dotenvPath = data.dotenvPath || ".env"
    let envFilePath = path.join(projectFolder, dotenvPath)

    if (!fs.existsSync(envFilePath)) {
      fs.writeFileSync(envFilePath, "")
    }

    dotenv.config({
      path: envFilePath,
      quiet: true,
    })
    global.dotenv = {
      ...process.env,
    }
    console.log(`[dotenv] dotenv Initialized.`)
  },

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `dotenv Is Automatically Started On Bot Ready!`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }
    console.log(`dotenv Is Automatically Started On Bot Ready!`)
  },
}
