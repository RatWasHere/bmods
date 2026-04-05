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
    const { shell } = require("electron")

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

    function showDonatePopup() {
      return new Promise((resolve) => {
        const overlay = document.createElement("div")
        overlay.style.cssText = `
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
        `

        const modal = document.createElement("div")
        modal.style.cssText = `
          background: #1e1e2e;
          color: #fff;
          padding: 20px;
          border-radius: 15px;
          width: 500px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          font-family: sans-serif;
          box-sizing: border-box;
        `

        modal.innerHTML = `
          <h2 style="margin:0 0 12px; font-size:22px">❤️ Enjoy this drag and drop import feature?</h2>
          <p style="margin:0 0 32px; color:#aaa; font-size:15px">Consider making a donation to support development!</p>
          <div style="display:flex; gap:12px; padding: 0 8px">
            <button id="noThanks" 
              onmouseenter="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='#888'; this.style.color='#fff'"
              onmouseleave="this.style.background='transparent'; this.style.borderColor='#555'; this.style.color='#aaa'"
              style="flex:1; padding:12px; border-radius:8px; border:1px solid #555;
                background:transparent; color:#aaa; cursor:pointer; font-size:15px; transition: all 0.2s">
              💔 No Thanks
            </button>
            <button id="donateBtn"
              onmouseenter="this.style.background='#4752c4'"
              onmouseleave="this.style.background='#5865f2'"
              style="flex:1; padding:12px; border-radius:8px; border:none;
                background:#5865f2; color:#fff; cursor:pointer; font-size:15px; font-weight:600; transition: all 0.2s">
              💖 Donate
            </button>
          </div>
        `

        overlay.appendChild(modal)
        document.documentElement.appendChild(overlay)

        const cleanup = () => overlay.remove()

        document.getElementById("noThanks").onclick = () => {
          cleanup()
          resolve("no")
        }

        document.getElementById("donateBtn").onclick = () => {
          cleanup()
          shell.openExternal("https://ko-fi.com/slothyacedia")
          resolve("donate")
        }
      })
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

    if (options.result) {
      let elementAnchor = document.getElementById("collaborationStatus")

      let exportButton
      let importButton

      // Drag & Drop
      function dragAndDrop() {
        let commandBar = document.getElementById("commandbar")

        commandBar.addEventListener("dragover", (event) => {
          event.preventDefault()
        })

        commandBar.addEventListener("dragleave", () => {})

        commandBar.addEventListener("drop", async (event) => {
          event.preventDefault()
          getPreferences()
          if (event.dataTransfer.files.length == 0) {
            return
          }
          let botData = JSON.parse(fs.readFileSync(editorDataFilePath))
          let commands = botData.commands
          let files = Array.from(event.dataTransfer.files)
          let importCount = 0
          let jsonFiles = files.filter((f) => f.name.toLowerCase().endsWith(".json"))

          if (jsonFiles.length < 1) {
            return
          }

          await Promise.all(
            jsonFiles.map(async (file) => {
              try {
                const fileContent = await file.text()
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

          if (importCount > 0) {
            preferences.importDnD = (Number(preferences.importDnD) || 0) + importCount
            if (preferences.importDnD >= 10 && !preferences.donoPopup) {
              preferences.importDnD = Number(preferences.importDnD) % 10
              await showDonatePopup()
            }
            fs.writeFileSync(preferencesFilePath, JSON.stringify(preferences, null, 2))
            try {
              options.result(titleCase(`✅ ${importCount} Command${importCount > 1 ? "s" : ""} Imported Successfully, Reloading...`))
            } catch {}
            setTimeout(() => location.reload(), 1000)
          } else {
            try {
              options.result(titleCase(`⚠️ No Commands Imported`))
            } catch {}
          }
        })
      }

      // Export Tab
      function exportBtn() {
        exportButton = document.createElement("div")
        exportButton.classList = "hoverablez option"
        exportButton.innerHTML = `Export`
        exportButton.id = "ceiExport"
        exportButton.onclick = async () => {
          getPreferences()
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
        }
      }

      // Import Tab
      function importBtn() {
        importButton = document.createElement("div")
        importButton.classList = "hoverablez option"
        importButton.innerHTML = `Import`
        importButton.id = "ceiImport"
        importButton.onclick = async () => {
          getPreferences()
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
        }
      }

      dragAndDrop()
      exportBtn()
      importBtn()

      let container = document.createElement("div")
      container.id = "commandExImQA"
      container.style.display = "flex"
      container.appendChild(exportButton)
      container.appendChild(importButton)
      container.appendAfter(elementAnchor)
    }
  },
}
