modVersion = "v2.1.0 | AceFix"
module.exports = {
  data: {
    name: "Create File",
  },
  category: "Files",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["node:path", "node:fs"],
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path",
    },
    "-",
    {
      element: "largeInput",
      placeholder: "File Text Content",
      storeAs: "content",
      name: "Content",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (data) => {
    return `Path: ${data.path} - Content: ${data.content}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const path = require("node:path")
    const fs = require("node:fs")
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    filePath = bridge.transf(values.path)

    let fullPath
    if (
      workingDir.includes(path.join("common", "Bot Maker For Discord")) ||
      workingDir.endsWith("Bot Maker For Discord") ||
      fs.existsSync(path.join(workingDir, "AppData", "Kits", "flex.js")) ||
      fs.existsSync(path.join(workingDir, "linux-data")) ||
      fs.existsSync(path.join(workingDir, "mac-data")) ||
      fs.existsSync(path.join(workingDir, "resources", "app.asar.unpacked", "app.asar")) ||
      (fs.existsSync(path.join(workingDir, "stage1")) &&
        fs.existsSync(path.join(workingDir, "stage2")) &&
        fs.existsSync(path.join(workingDir, "stage3")) &&
        fs.existsSync(path.join(workingDir, "stage4")) &&
        fs.existsSync(path.join(workingDir, "stage5")))
    ) {
      fullPath = path.join(botData.prjSrc, filePath)
    } else {
      fullPath = path.join(workingDir, filePath)
    }

    fullPath = path.normalize(fullPath)
    const dirName = path.dirname(fullPath)

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true })
    }

    fs.writeFileSync(fullPath, bridge.transf(values.content))
  },
}
