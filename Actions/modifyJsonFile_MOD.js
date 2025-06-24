modVersion = "v1.0.5"
module.exports = {
  data: {
    name: "Modify JSON File"
  },
  aliases: ["Edit JSON File"],
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
      element: "typedDropdown",
      storeAs: "jsonAction",
      name: "Action",
      choices: {
        create: {name: "Create/Replace Element", field: true, placeholder: "path.to.element"},
        delete: {name: "Delete Element", field: true, placeholder: "path.to.element"},
      },
    },
    {
      element: "largeInput",
      storeAs: "content",
      name: "Content",
    },
    "-",
    {
      element: "html",
      html: `
        <button
          style="width: fit-content"
          class="hoverablez"
          onclick="
                  const textArea = document.getElementById('content');
                  const content = textArea.value;
                  const btext = this.querySelector('#buttonText');

                  if (!this.dataset.fixedSize) {
                    this.style.width = this.offsetWidth + 'px';
                    this.style.height = this.offsetHeight + 'px';
                    this.dataset.fixedSize = 'true';
                  }

                  try {
                    let parsed = JSON.parse(content);
                    let formatted = JSON.stringify(parsed, null, 2);
                    this.style.background = '#28a745';
                    btext.textContent = 'Valid';
                    if (content !== formatted){
                      textArea.value = formatted;
                      let textLength = textArea.value.length;
                      textArea.focus();
                      textArea.setSelectionRange(textLength, textLength);
                    }
                  } catch (error) {
                    this.style.background = '#dc3545';
                    btext.textContent = 'Invalid';
                  }
                  setTimeout(() => {
                    this.style.background = '';
                    btext.textContent = 'Validate JSON';
                  }, 500);
                "
        >
          <btext id="buttonText"> Validate JSON </btext>
        </button>
      `
    },
    {
      element: "text",
      text: `Wrap your variables with double quotes ("), i.e "\${tempVars('varName')}".`
    },
    "-",
    {
      element: "toggleGroup",
      storeAs: ["createIfMissing", "prettyPrint"],
      nameSchemes: ["Create File If Missing", "Pretty Print?"],
    },
    {
      element: "store",
      storeAs: "modifiedJson",
      name: "Store Modified JSON As"
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
    const fs = require("node:fs")
    
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}
    
    let pathToJson = path.normalize(bridge.transf(values.pathToJson))

    let fullPath = path.join(path.normalize(projectFolder), pathToJson)
    let parsedPath = path.parse(fullPath)
    fullPath = path.join(parsedPath.dir, parsedPath.name + ".json")

    const forbiddenFiles = [
      path.normalize("AppData/Toolkit/storedData.json"),
      path.normalize("AppData/data.json"),
      path.normalize("vars.json"),
      path.normalize("schedules")
    ]
    if (forbiddenFiles.some(fp => fullPath.endsWith(fp))){
      return console.error(`Essential Files Are Not To Be Messed With!!`)
    }
    
    if (!fs.existsSync(fullPath)){
      if (values.createIfMissing === true){

        let dirName = path.dirname(fullPath)
        if (!fs.existsSync(dirName)){
          fs.mkdirSync(dirName, { recursive: true })
        }

        fs.writeFileSync(fullPath, JSON.stringify({}, null))
      } else {
        return console.error(`File ${fullPath} Doesn't Exist!`)
      }
    }

    const originalFileContent = fs.readFileSync(fullPath, "utf8")
    let jsonObject
    let isJson

    function cleanEmpty(obj, keys) {
      for (let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i]
        let parent = keys.slice(0, i).reduce((o, k) => o?.[k], obj)
        if (parent && Object.keys(parent[key] || {}).length === 0) {
          delete parent[key]
        } else {
          break
        }
      }
    }

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

    try {
      jsonObject = JSON.parse(originalFileContent)
      isJson = true
    } catch (err){
      console.error(`Invalid Original JSON Content: ${err.message}`)
      jsonObject = originalFileContent
      isJson = false
      return
    }

    let actionType = bridge.transf(values.jsonAction.type)
    let objectPath = bridge.transf(values.jsonAction.value).trim()
    let rawContent = bridge.transf(values.content)


    rawContent = sanitizeArrays(rawContent)
    if (!/^\s*(\[|\{)/.test(rawContent)) {
      rawContent = `"${rawContent.replace(/^["']|["']$/g, '').replace(/"/g, '\\"')}"`
    }

    objectPath = objectPath.replaceAll("..", ".")
    if (objectPath.startsWith(".")) {
      objectPath = objectPath.slice(1)
    }

    if (
      objectPath === "" ||
      objectPath.includes("..") ||
      objectPath.startsWith(".") ||
      objectPath.endsWith(".")
    ) {return console.error(`Invalid path: "${bridge.transf(values.jsonAction.values)}"`)}

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
        case "create":{
          target[lastKey] = parsedContent
          break
        }

        case "delete":{
          delete target[lastKey]
          cleanEmpty(jsonObject, keys)
          break
        }
      }
    }

    let finalContent
    if (values.prettyPrint === true){
      finalContent = JSON.stringify(jsonObject, null, 2)
    } else {finalContent = JSON.stringify(jsonObject, null)}

    fs.writeFileSync(fullPath, finalContent)
    bridge.store(values.modifiedJson, jsonObject)
  }
}