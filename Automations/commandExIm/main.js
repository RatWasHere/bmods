modVersion = "v1.5.6"

const modMan = {
  installModule(moduleName, version) {
    return new Promise((resolve) => {
      try {
        require("child_process").execSync(`npm i ${version ? `${moduleName}@${version}` : moduleName}`)
        return resolve(require(moduleName))
      } catch (error) {
        return console.log(`The required module "${version ? `${moduleName}@${version}` : moduleName}" has been installed. Please restart your bot.`)
      }
    })
  },

  async require(moduleName, version) {
    try {
      return require(moduleName)
    } catch (e) {
      await this.installModule(moduleName, version)
      return require(moduleName)
    }
  },
}

module.exports = {
  run: async (options) => {
    const fs = require("node:fs")
    const path = require("node:path")
    const os = require("node:os")
    const crypto = require("node:crypto")

    let editorDataFilePath = path.join(process.cwd(), "AppData", "data.json")
    let preferencesFilePath = path.join(process.cwd(), "Automations", "commandExIm", "preferences.json")

    let defaultPreferences = {
      export: "",
      importDnD: 0,
    }

    if (!fs.existsSync(preferencesFilePath)) {
      fs.mkdirSync(path.dirname(preferencesFilePath), { recursive: true })
      fs.writeFileSync(preferencesFilePath, JSON.stringify(defaultPreferences, null, 2))
    }
    let preferences

    function getPreferences() {
      let preferencesRaw = fs.readFileSync(preferencesFilePath)
      preferences = JSON.parse(preferencesRaw)
    }

    let validateCmdJSON = (commandJSON) => {
      if (typeof commandJSON.name != "string") {
        return false
      }

      if (typeof commandJSON.type != "string") {
        return false
      }

      if (typeof commandJSON.trigger != "string") {
        return false
      }

      if (!Array.isArray(commandJSON.actions)) {
        return false
      }

      if (typeof commandJSON.customId != "number") {
        return false
      }

      return true
    }

    let titleCase = (string) =>
      string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    let data = await options.showInterface([
      {
        element: "typedDropdown",
        storeAs: "action",
        name: "Action",
        choices: {
          export: { name: "Export" },
          import: { name: "Import" },
        },
      },
      "-",
      {
        element: "text",
        text: modVersion,
      },
    ])

    switch (data.action.type) {
      case "export": {
        getPreferences()
        let exportButton = document.getElementById("ceiExport")
        let downloadsDir = path.join(os.homedir(), "Downloads")
        let defaultDownloadsDir = downloadsDir
        if (preferences.export !== "" && preferences.export !== "undefined") {
          downloadsDir = preferences.export
        }
        if (!fs.existsSync(downloadsDir)) {
          downloadsDir = defaultDownloadsDir
        }

        let commandTypes = {
          textCommand: "Text Cmd",
          slashCommand: "Slash Cmd",
          anyMessage: "Any Message",
          messageContent: "Message Content",
          message: "Message Cmd",
          user: "User Cmd",
          event: "Event",
        }

        let botData = JSON.parse(fs.readFileSync(editorDataFilePath))
        let commands = botData.commands

        let exportUI = [
          {
            element: "input",
            storeAs: "exportPath",
            name: "Export Path",
          },
          "_",
          {
            element: "html",
            html: `
              <button
                style="width: var(--width-in-editor); margin-left: auto; margin-right: auto"
                class="hoverablez flexbox"
                onclick="
                  let inputPath = awaitIPCResponse({channel: 'saveDialog'}, 'saveDialogResult').then(path => {
                    let inputPath = path[0]
                    let inputArea = document.getElementById('exportPath')
                    if (inputPath == undefined) {
                      inputArea.focus()
                      return
                    }
                    inputArea.value = inputPath
                    inputArea.focus()
                  })"
              >
                <btext id="buttonText"> Choose Export Path </btext>
              </button>
              `,
          },
          "_",
          {
            element: "toggleGroup",
            storeAs: ["zip", "inverse"],
            nameSchemes: ["Zip It", "Inverse Selection"],
          },
          "-",
          {
            element: "text",
            text: `<div style="text-align: center">
              Enabling "Zip It" Will Make Create A Zip File Of The Exported Commands<br>
              Enabling "Inverse Selection" Will Export Those Not Selected
              </div>
              `,
          },
          "-",
        ]

        let defaultData = {
          exportPath: downloadsDir,
        }

        commands.forEach((command) => {
          exportUI.push(
            {
              element: "menu",
              max: 1,
              name: `[${commandTypes[command.trigger] || "Unknown"}] ${command.name}`,
              storeAs: `${command.customId}`,
              types: { command: "command" },
              UItypes: {
                command: {
                  name: command.name,
                  UI: [{ element: "input", storeAs: "name", name: "Name" }],
                  data: {
                    name: command.name,
                    data: command,
                  },
                },
              },
            },
            "_",
          )
        })

        exportUI.push("-", { element: "text", text: modVersion })

        resultData = await options.showInterface(exportUI, defaultData)
        if (resultData.exportPath !== preferences.export) {
          preferences.export = path.normalize(resultData.exportPath)
          fs.writeFileSync(preferencesFilePath, JSON.stringify(preferences, null, 2))
        }

        let exportCount = 0
        downloadsDir = path.normalize(resultData.exportPath)
        let zipIt = resultData.zip
        let inverseSelection = resultData.inverse
        delete resultData["exportPath"]
        delete resultData["zip"]
        delete resultData["inverse"]
        let selectedIds = Object.keys(resultData).filter((commandId) => resultData[commandId]?.length > 0)
        if (inverseSelection == true) {
          let botData = JSON.parse(fs.readFileSync(editorDataFilePath))
          let commands = botData.commands
          selectedIds = Object.keys(resultData).filter((commandId) => resultData[commandId]?.length == 0)
          for (let selectedId of selectedIds) {
            resultData[selectedId] = [
              {
                data: {
                  data: commands.find((command) => command.customId == selectedId),
                  name: commands.find((command) => command.customId == selectedId).name,
                },
              },
            ]
          }
        }

        if (!fs.existsSync(downloadsDir) && selectedIds.length > 0) {
          fs.mkdirSync(downloadsDir, { recursive: true })
        }

        if (selectedIds.length === 0) {
          return options.result(titleCase(`⚠️ No Commands Were Selected For Export`))
        }

        let exportPaths = []

        if (exportButton) {
          exportButton.innerHTML = "Export (Exporting...)"
          await new Promise((resolve) => setTimeout(resolve, 350))
        }

        for (let id of selectedIds) {
          let selectedData = resultData[id][0].data
          let fileNameHash = crypto
            .createHash("md5")
            .update(`${JSON.stringify(selectedData.data.name)}-${Date.now()}`)
            .digest("hex")
            .slice(0, 8)
          let fileName = (selectedData.name || `Unnamed_Command-${fileNameHash}`).replace(/[^\w\-]+/g, "_")
          let exportPath = path.join(downloadsDir, `${fileName}.json`)

          try {
            fs.writeFileSync(exportPath, JSON.stringify(selectedData.data, null, 2))
            exportCount++
            exportPaths.push(exportPath)
          } catch {
            try {
              options.burstInform({ element: "text", text: titleCase(`⚠️ Unable To Write To ${exportPath}`) })
            } catch {}
          }
        }

        if (exportButton) {
          exportButton.innerHTML = `Export (Exported ${exportCount} Files)`
          await new Promise((resolve) => setTimeout(resolve, 350))
        }

        if (zipIt == true) {
          if (exportButton) {
            exportButton.innerHTML = "Export (Zipping...)"
            await new Promise((resolve) => setTimeout(resolve, 350))
          }
          const archiver = await modMan.require("archiver")
          zipResult = await new Promise((resolve, reject) => {
            let zipFilePath
            if (path.basename(downloadsDir).toLowerCase() == "downloads") {
              let zipHash = crypto.createHash("md5").update(`${Date.now()}`).digest("hex").slice(0, 6)
              zipFilePath = path.join(downloadsDir, `bmdExports-${zipHash}.zip`)
            } else {
              zipFilePath = `${downloadsDir}.zip`
            }

            let archiveStream = fs.createWriteStream(zipFilePath)
            let archive = new archiver("zip", { zlib: { level: 9 } })
            archiveStream.on("close", resolve)
            archiveStream.on("error", reject)
            archive.on("error", reject)

            archive.pipe(archiveStream)

            for (let exportPath of exportPaths) {
              if (!fs.existsSync(exportPath)) {
                try {
                  options.burstInform({ element: "text", text: titleCase(`⚠️ ${exportPath} Doesn't Exist`) })
                } catch {}
                continue
              }

              let nameInZip = path.basename(exportPath)
              archive.file(exportPath, { name: nameInZip })
            }
            archive.finalize()
            return true
          })

          if (zipResult == true) {
            if (exportButton) {
              exportButton.innerHTML = "Export (Zipped)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
            try {
              options.burstInform({ element: "text", text: titleCase(`✅ Zipped`) })
            } catch {}
          }
        }

        if (exportButton) {
          exportButton.innerHTML = "Export (Complete)"
          setTimeout(() => {
            exportButton.innerHTML = "Export"
          }, 350)
        }
        try {
          options.result(titleCase(`✅ Exported ${exportCount} Command(s) To ${downloadsDir}`))
        } catch {}
        break
      }

      case "import": {
        getPreferences()
        let importButton = document.getElementById("ceiImport")
        let botData = JSON.parse(fs.readFileSync(editorDataFilePath))
        let commands = botData.commands
        let importFolderPath = path.join(process.cwd(), "Automations", "commandExIm", "ImportCache")
        if (fs.existsSync(importFolderPath)) {
          fs.rmSync(importFolderPath, { recursive: true, force: true })
        }
        fs.mkdirSync(importFolderPath, { recursive: true })
        let defaultData = { generateBackup: true }

        let importUI = [
          {
            element: "html",
            html: `
                <div
                id="dropArea"
                style="width: var(--width-in-editor);
                height: 60px;
                margin-left: auto;
                margin-right: auto;
                border: 2px dashed #555;
                border-radius: 6px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition:
                border-color 0.2s;
                box-sizing: border-box"
                class="hoverablez noanims"
                ondragover="event.preventDefault(); this.style.borderColor='#00b4d8';"
                ondragleave="this.style.borderColor='#555';"
                ondrop="
                  event.preventDefault();
                  this.style.borderColor='#555';
                  let files = event.dataTransfer.files;
                  let dropArea = this
                  let dropText = dropArea.querySelector('#dropText')
                  let consoleArea = document.getElementById('console')

                  function logToConsole(msg, color){
                    let line = document.createElement('div')
                    line.style.color = color
                    line.textContent = msg
                    consoleArea.appendChild(line)
                    consoleArea.scrollTop = consoleArea.scrollHeight
                  }

                  let validateCmdJSON = (commandJSON) => {
                    if (typeof commandJSON.name != 'string') {
                      return false
                    }

                    if (typeof commandJSON.type != 'string') {
                      return false
                    }

                    if (typeof commandJSON.trigger != 'string') {
                      return false
                    }

                    if (!Array.isArray(commandJSON.actions)) {
                      return false
                    }

                    if (typeof commandJSON.customId != 'number') {
                      return false
                    }

                    return true
                  }

                  for (let file of files){

                    if (!file.name.toLowerCase().endsWith('.json')){
                      logToConsole('Invalid File (Non-JSON): ' + file.name, '#ff0000')
                      continue
                    }

                    file.text().then(fileContent => {
                      try {
                        commandJSON = JSON.parse(fileContent)
                        if (validateCmdJSON(commandJSON)){
                          const fs = require('fs')
                          const path = require('path')
                          let tempImportDir = path.join(process.cwd(), 'Automations', 'commandExIm', 'importCache')
                          let fileName = (commandJSON.name + '_' + commandJSON.type + Date.now()).replace(/[^\\w\\-]+/g, '_') + '.json'
                          let importFilePath = path.join(tempImportDir, fileName)
                          console.log(importFilePath)
                          fs.writeFileSync(importFilePath, JSON.stringify(commandJSON, null, 2))
                          logToConsole('File Cached For Import: ' + file.name, '#00ff00')
                        } else {
                          throw new error('Content Not Valid JSON')}
                      } catch {logToConsole('Invalid File (Invalid Command Structure): ' + file.name, '#ff0000')}
                    })
                  }
                "
              >
                <span id="dropText">Drop JSON File(s) Here</span>
              </div>
                `,
          },
          "-",
          {
            element: "toggle",
            storeAs: "generateBackup",
            name: "Generate Backup?",
          },
          "_",
          {
            element: "html",
            html: `
              <div
                id="console"
                class="noanims hoverablez"
                style="width: var(--width-in-editor);
                height: 150px;
                margin-left: auto;
                margin-right: auto;
                border-radius: 6px;
                font-size: 16px;
                overflow-y: auto;
                padding: 4px;
                box-sizing: border-box;
                border: 1px solid #555;"
              >
                <div style='color:#979797;'>Logs</div>
              </div>
              `,
          },
          "-",
          {
            element: "text",
            text: modVersion,
          },
        ]

        resultData = await options.showInterface(importUI, defaultData)
        let generateBackup = resultData.generateBackup
        let importCount = 0

        if (generateBackup) {
          if (importButton) {
            importButton.innerHTML = "Import (Backing Up...)"
            await new Promise((resolve) => setTimeout(resolve, 350))
          }
          let projectDir = botData.prjSrc
          let backupPath = path.join(projectDir, "backup_data.json")
          fs.writeFileSync(backupPath, JSON.stringify(botData, null, 2), "utf8")
          try {
            options.burstInform({ element: "text", text: titleCase(`✅ Backup Saved To ${backupPath}`) })
          } catch {}
        }

        if (importButton) {
          importButton.innerHTML = "Import (Importing...)"
          await new Promise((resolve) => setTimeout(resolve, 350))
        }

        let files = fs.readdirSync(importFolderPath)

        await Promise.all(
          files.map(async (file) => {
            let fileLoc = path.join(importFolderPath, file)
            try {
              const fileContent = fs.readFileSync(fileLoc)
              const commandJSON = JSON.parse(fileContent)
              if (validateCmdJSON(commandJSON)) {
                commands.push(commandJSON)
                importCount++
              } else {
                console.log(`Invalid Command JSON In ${file.name}`)
              }
            } catch (err) {
              console.log(`Failed To Parse ${file.name}:`, err)
            }
          }),
        )

        botData.commands = commands
        fs.writeFileSync(editorDataFilePath, JSON.stringify(botData, null, 2), "utf8")
        fs.rmSync(importFolderPath, { recursive: true, force: true })

        if (importCount > 0) {
          if (importButton) {
            importButton.innerHTML = `Import (${importCount} Files Imported)`
            await new Promise((resolve) => setTimeout(resolve, 350))
            importButton.innerHTML = "Import (Complete)"
            await new Promise((resolve) => setTimeout(resolve, 350))
            importButton.innerHTML = "Import"
          }
          try {
            options.result(titleCase(`✅ ${importCount} Command(s) Imported Successfully, Reloading...`))
          } catch {}
          setTimeout(() => location.reload(), 1000)
        } else {
          if (importButton) {
            importButton.innerHTML = "Import (No Imports)"
            await new Promise((resolve) => setTimeout(resolve, 350))
            importButton.innerHTML = "Import"
          }
          try {
            options.result(titleCase(`⚠️ No Commands Were Imported`))
          } catch {}
        }
        break
      }
    }
  },
}
