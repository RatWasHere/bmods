modVersion = "v1.0.2"
module.exports = {
  data: {
    name: "Read JSON File"
  },
  aliases: ["Get JSON File"],
  modules: ["node:path", "node:fs"],
  category: "JSON",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "pathToJson",
      name: "Path To JSON File",
      placeholder: "path/to/file.json"
    },
    {
      element: "input",
      storeAs: "pathToElement",
      name: "Path To Element (Optional)",
      placeholder: "path.to.element | Leave Empty To Read The Whole JSON File",
    },
    "-",
    {
      element: "store",
      storeAs: "jsonObject",
      name: "Store JSON Object As",
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Store ${values.pathToJson} As JSON Object`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const path = require("node:path")
    const fs = require("node:fs")

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}

    let pathToJson = path.normalize(bridge.transf(values.pathToJson))

    let fullPath = path.join(path.normalize(projectFolder), pathToJson)
    if (!fs.existsSync(fullPath)){
      return console.error(`File ${fullPath} Doesn't Exist!`)
    }

    const originalFileContent = fs.readFileSync(fullPath, "utf8")
    let jsonObject
    try {
      jsonObject = JSON.parse(originalFileContent)
    } catch (err){
      return console.error(`Invalid Original JSON Content: ${err.message}`)
      jsonObject = {}
    }

    let finalResult = jsonObject
    if (values.pathToElement){
      let elementPath = bridge.transf(values.pathToElement).trim()
      elementPath = elementPath.replaceAll("..", ".")
      if (elementPath.startsWith(`.`)){
        elementPath.slice(1)
      }

      if (
        elementPath === "" ||
        elementPath.includes("..") ||
        elementPath.startsWith(".") ||
        elementPath.endsWith(".")
      ){
        console.error(`Invalid path: "${elementPath}"`)
        continue
      }

      try{
        const keys = elementPath.replace(/\[(\d+)\]/g, `.$1`).split(`.`).filter(Boolean)

        for (const key of keys){
        if (finalResult && Object.prototype.hasOwnProperty.call(finalResult, key)){
          finalResult = finalResult[key]
        } else {finalResult = undefined}
      }
      }catch(err){
        return console.error(`Failed To Parse Path "${elementPath}": ${err.message}`)
      }
    }

    bridge.store(values.jsonObject, finalResult)
  }
}