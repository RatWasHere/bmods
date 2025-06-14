modVersion = "v1.0.1"


module.exports = {
  data: {
    name: "Create JSON File"
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
      storeAs: "jsonFilePath",
      name: "File Path",
      placeholder: "path/to/file.json"
    },
    {
      element: "largeInput",
      storeAs: "content",
      name: "File Content",
    },
    "-",
    {
      element: "html",
      html: `
        <button style="width: fit-content;" class="hoverablez" onclick="
          const content = document.getElementById('content').value;
          const btext = this.querySelector('#buttonText')

          if (!this.dataset.fixedSize) {
            this.style.width = this.offsetWidth + 'px';
            this.style.height = this.offsetHeight + 'px';
            this.dataset.fixedSize = 'true';
          }

          try {
            JSON.parse(content);
            this.style.background = '#28a745';
            btext.textContent = 'Valid';
            document.getElementById('content').value = JSON.stringify(JSON.parse(content), null, 2);
          } catch (error) {
            this.style.background = '#dc3545';
            btext.textContent = 'Invalid';
          }
          setTimeout(() => {
            this.style.background = '';
            btext.textContent = 'Validate JSON';
          }, 500);
        "><btext id="buttonText">
          Validate JSON
          </btext>
        </button>
      `
    },
    {
      element: "text",
      text: `Wrap your variables with double quotes ("), i.e "\${tempVars('varName')}".`
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
    return `Create JSON File In ${values.jsonFilePath}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const path = require("node:path")
    const fs = bridge.fs

    let destination = path.normalize(bridge.transf(values.jsonFilePath))

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}

    let fullPath = path.join(path.normalize(projectFolder),destination)
    const forbiddenFiles = [
      path.normalize("AppData/Toolkit/storedData.json"),
      path.normalize("AppData/data.json"),
      path.normalize("vars.json"),
      path.normalize("schedules")
    ]
    if (forbiddenFiles.some(fp => fullPath.endsWith(fp))){
      return console.error(`Essential Files Are Not To Be Messed With!!`)
    }
    let dirName = path.dirname(fullPath)

    if (!fs.existsSync(dirName)){
      fs.mkdirSync(dirName, { recursive: true })
    }

    let jsonString = bridge.transf(values.content)
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

    jsonString = sanitizeArrays(jsonString)
    if (!/^\s*(\[|\{)/.test(jsonString)) {
      jsonString = `"${jsonString.replace(/^["']|["']$/g, '').replace(/"/g, '\\"')}"`
    }
    let jsonObject

    try {
      jsonObject = JSON.parse(jsonString)
    } catch (error){
      console.error(`Invalid JSON Content: ${error.message}`)
      jsonObject = {}
    }
    
    let finalContent
    if (values.prettyPrint === true){
      finalContent = JSON.stringify(jsonObject, null, 2)
    } else {finalContent = JSON.stringify(jsonObject, null)}
    fs.writeFileSync(fullPath, finalContent)
  }
}