modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Modify JSON File"
  },
  aliases: [],
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
      name: "Path To Json File",
      placeholder: "path/to/file.json"
    },
    {
      element: "typedDropdown",
      storeAs: "jsonAction",
      name: "Action",
      choices: {
        create: {name: "Create/Replace Element", field: true, placeholder: "path.to.element"},
        delete: {name: "Delete Element", field: true, placeholder: "path.to.element"},
      },
    },
    {
      element: "",
      storeAs: "content",
      name: "Content",
      large: true
    },
    "",
    {
      element: "",
      html: `
        <button style="width: fit-content;" onclick="
          const content = document.getElementById('content').value;
          try {
            JSON.parse(content);
            this.style.background = 'green';
          } catch (error) {
            this.style.background = 'red';
          }
          setTimeout(() => {
            this.style.background = '';
          }, 500);
        "><btext>
          Validate JSON
          </btext>
        </button>
      `
    },
    {
      element: "",
      text: `JSON Validation Button May Not Work If You're Using Variables.<br>Green = Valid JSON<br>Red = Invalid JSON`
    },
    "-",
    {
      element: "toggle",
      storeAs: "prettyPrint",
      name: "Pretty Print?",
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Modify Contents Of ${values.pathToJson}`
  },

  script: (values) =>{
    function refelm(skipAnimation){
      if (values.data.jsonAction.type == "create"){
        values.UI[2].element = "largeInput"
        values.UI[3].element = "-"
        values.UI[4].element = "html"
        values.UI[5].element = "text"
      } else {
        values.UI[2].element = ""
        values.UI[3].element = ""
        values.UI[4].element = ""
        values.UI[5].element = ""
      }

      setTimeout(()=>{
        values.updateUI()
      },skipAnimation?1:values.commonAnimation*100)
    }

    refelm(true)

    values.events.on("change", ()=>{
      refelm()
    })
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const path = require("node:path")
    const fs = bridge.fs
    
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}
    
    let pathToJson = path.normalize(bridge.transf(values.pathToJson))

    let fullPath = path.join(path.normalize(projectFolder), pathToJson)

    const forbiddenFiles = [
      path.normalize("AppData/Toolkit/storedData.json"),
      path.normalize("AppData/data.json")
    ]
    if (forbiddenFiles.some(fp => fullPath.endsWith(fp))){
      return console.error(`Essential Files Are Not To Be Messed With!!`)
    }
    if (!fs.existsSync(fullPath)){
      return console.error(`File ${fullPath} Doesn't Exist!`)
    }

    const originalFileContent = fs.readFileSync(fullPath, "utf8")
    let jsonObject
    let isJson
    try {
      jsonObject = JSON.parse(originalFileContent)
      isJson = true
    } catch (err){
      return console.error(`Invalid Original JSON Content: ${err.message}`)
      jsonObject = originalFileContent
      isJson = false
    }

    let actionType = bridge.transf(values.jsonAction.type)
    let objectPath = bridge.transf(values.jsonAction.value).trim()
    let rawContent = bridge.transf(values.content)

    const sanitizeArrays = (str) => {
      return str.replace(/\[([^\]]*)\]/g, (match, inner) => {
        const sanitized = inner
          .split(',')
          .map(el => {
            el = el.trim()
            if (el === '') return null
            return '"' + el.replace(/^["']|["']$/g, '').replace(/"/g, '\\"') + '"'
          })
          .filter(el => el !== null)
          .join(', ')
        return `[${sanitized}]`
      })
    }

    rawContent = sanitizeArrays(rawContent)
    if (!/^\s*(\[|\{)/.test(rawContent)) {
      rawContent = `"${rawContent.replace(/^["']|["']$/g, '').replace(/"/g, '\\"')}"`
    }

    if (objectPath.startsWith(".")) {
      objectPath = objectPath.slice(1)
    }

    // Validate path
    if (
      objectPath === "" ||
      objectPath.includes("..") ||
      objectPath.startsWith(".") ||
      objectPath.endsWith(".")
    ) {
      return console.error(`Invalid path: "${bridge.transf(values.jsonAction.values)}"`)
      }
    const keys = objectPath.split(".")
    const lastKey = keys.pop()
    let target = jsonObject

    for (const key of keys) {
      if (typeof target[key] !== "object" || target[key] === null) {
        target[key] = {}
      }
      target = target[key]
    }

    let parsedContent = undefined
    if (actionType !== "delete") {
      try {
        parsedContent = JSON.parse(rawContent)
      } catch (err) {
        return console.error(`Invalid JSON for content: ${err.message}`)
      }
    }

    if (jsonObject && isJson == true){
      switch(actionType){
        case "create":
          target[lastKey] = parsedContent
          break

        case "delete":
          delete target[lastKey]
          let cleanupObj = jsonObject
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (Object.keys(cleanupObj[key]).length === 0) {
              delete cleanupObj[key]
              break
            }
            cleanupObj = cleanupObj[key]
          }
          break
      }
    }

    let finalContent
    if (values.prettyPrint === true){
      finalContent = JSON.stringify(jsonObject, null, 2)
    } else {finalContent = JSON.stringify(jsonObject, null)}

    fs.writeFileSync(fullPath, finalContent)
  }
}