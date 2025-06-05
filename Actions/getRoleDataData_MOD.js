modVersion = "s.v1.0"
module.exports = {
  data: { name: "Get All Roles Data Data" },
  category: "Role Data",
  info: {
      source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
      creator: "Acedia",
      donate: "https://ko-fi.com/slothyacedia"
  },
  UI: [
    {
      element: "store",
      storeAs: "store"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],
  async run(values, message, client, bridge) {

    // initialize roles if it doesnt exist
    const path = require("node:path")
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}

    let storedPath = path.join(projectFolder, "AppData", "ToolKit", "storedData.json")
    let storedData = JSON.parse(bridge.fs.readFileSync(storedPath))

    if (!storedData.roles){
      storedData.roles = {}
      bridge.fs.writeFileSync(storedPath, JSON.stringify(storedData))
    }

    storedData = bridge.data.IO.get();
    if (!storedData.roles){
      storedData.roles = {}
    }
    bridge.data.IO.write(storedData)
    bridge.store(values.store, storedData.roles)
  }
}