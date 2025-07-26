modVersion = "v2.1.0 | AceFix"
module.exports = {
  data: {
    name: "Create File",
  },
  category: "Files",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia"
  },
  modules: ["node:path", "node:fs"],
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path"
    },
    "-",
    {
      element: "largeInput",
      placeholder: "File Text Content",
      storeAs: "content",
      name: "Content"
    },
    {
      element: "text",
      text: modVersion
    }
  ],
  subtitle: (data) => {
    return `Path: ${data.path} - Content: ${data.content}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }
    
    const path = require("node:path")
    const fs = require("node:fs")
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    filePath = bridge.transf(values.path)
    
    let fullPath
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      fullPath = path.join(botData.prjSrc, filePath)
    } else {
      fullPath = path.join(workingDir, filePath)
    }

    fullPath = path.normalize(fullPath)
    const dirName = path.dirname(fullPath)

    if (!fs.existsSync(dirName)){
      fs.mkdirSync(dirName, { recursive: true })
    }

    fs.writeFileSync(fullPath, bridge.transf(values.content))
  },
};
