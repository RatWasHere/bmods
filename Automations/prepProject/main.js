modVersion = "v1.2.1"
module.exports = {
  run: async (options) => {
    const fs = require("node:fs")
    const path = require("node:path")

    let dataJSONPath = path.join(process.cwd(), "AppData", "data.json")
    let botData = JSON.parse(fs.readFileSync(dataJSONPath))
    let projectFolder = botData.prjSrc

    let initPageDefaultData = {
      downloadScripts: false,
      syncActions: true,
      syncEvents: true,
    }

    let initPageData = await options.showInterface(
      [
        {
          element: "typedDropdown",
          storeAs: "environment",
          name: "Hosting Environment",
          choices: {
            windows: { name: "Windows", field: false },
            linux: { name: "Linux", field: false },
            macos: { name: "macOS", field: false },
          },
        },
        "_",
        {
          element: "toggle",
          storeAs: "downloadScripts",
          name: "Download Start Scripts",
        },
        "_",
        {
          element: "toggleGroup",
          storeAs: ["syncActions", "syncEvents"],
          nameSchemes: ["Sync Actions", "Sync Events"],
        },
        "_",
        {
          element: "toggleGroup",
          storeAs: ["removeUnusedActions", "removeUnusedEvents"],
          nameSchemes: ["Remove Unused Actions", "Remove Unused Events"],
        },
        // "_",
        // {
        //   element: "toggle",
        //   storeAs: "modifyRuntime",
        //   name: "Exported Project?",
        //   help: {
        //     title: "What Is This Used For?",
        //     UI: [
        //       {
        //         element: "text",
        //         text: "This tells the automation that it is meant to be a export and it will modify certain files to allow it to run flawlessly.",
        //       },
        //     ],
        //   },
        // },
        "-",
        {
          element: "text",
          text: modVersion,
        },
      ],
      initPageDefaultData,
    )

    const findActionFiles = (rootNode) => {
      const fileSet = new Set()

      const traverse = (node) => {
        if (!node || typeof node !== "object") return
        if (Array.isArray(node)) {
          for (const item of node) {
            traverse(item)
          }
        } else {
          if (typeof node.file === "string") {
            fileSet.add(node.file)
          }
          if (typeof node.eventFile === "string") {
            fileSet.add(node.eventFile)
          }
          for (const key in node) {
            if (Object.prototype.hasOwnProperty.call(node, key)) {
              traverse(node[key])
            }
          }
        }
      }

      traverse(rootNode)
      return Array.from(fileSet)
    }

    let elementTab = document.getElementById("prepProjectQA")
    if (initPageData.downloadScripts == true) {
      if (elementTab) {
        elementTab.innerHTML = "Prep (Downloading Scripts)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }

      let scriptFilePath
      let persistScriptFilePath

      try {
        switch (initPageData.environment.type) {
          case "windows": {
            scriptFilePath = path.join(projectFolder, "start.bat")
            persistScriptFilePath = path.join(projectFolder, "start_persist.bat")

            let startScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/windows/start.bat`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/windows/start_persist.bat`, {
              method: "GET",
            })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            break
          }

          case "linux": {
            scriptFilePath = path.join(projectFolder, "start.sh")
            persistScriptFilePath = path.join(projectFolder, "start_persist.sh")

            let startScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/linux/start.sh`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/linux/start_persist.sh`, {
              method: "GET",
            })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            fs.chmodSync(scriptFilePath, 0o755)
            fs.chmodSync(persistScriptFilePath, 0o755)
            break
          }

          case "macos": {
            scriptFilePath = path.join(projectFolder, "start.command")
            persistScriptFilePath = path.join(projectFolder, "start_persist.command")

            let startScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/mac/start.sh`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyacedia/bmods-acedia/raw/refs/heads/main/Scripts/prep/mac/start_persist.sh`, {
              method: "GET",
            })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            fs.chmodSync(scriptFilePath, 0o755)
            fs.chmodSync(persistScriptFilePath, 0o755)
            break
          }

          default: {
            try {
              options.burstInform(`✅ Non Valid OS`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Non Valid OS)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
            break
          }
        }

        try {
          options.burstInform(`✅ Start Scripts Downloaded`)
        } catch {}
        if (elementTab) {
          elementTab.innerHTML = "Prep (Scripts Downloaded)"
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
      } catch {
        try {
          options.burstInform(`⚠️ Something Went Wrong...`)
        } catch {}
        if (elementTab) {
          elementTab.innerHTML = "Prep (Error Downloading Scripts)"
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
      }
    }

    if (elementTab) {
      elementTab.innerHTML = "Prep (Checking For storedData.json)"
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
    let storedDataPath = path.join(projectFolder, "AppData", "Toolkit", "storedData.json")
    if (!fs.existsSync(storedDataPath)) {
      if (elementTab) {
        elementTab.innerHTML = "Prep (Writing storedData.json)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      let defaultStoredData = {
        users: {},
        guilds: {},
        members: {},
        channels: {},
        lists: {},
        roles: {},
      }
      fs.writeFileSync(storedDataPath, JSON.stringify(defaultStoredData))
    }

    let currentDir = process.cwd()
    if (initPageData.syncActions == true || initPageData.removeUnusedActions == true) {
      if (elementTab) {
        elementTab.innerHTML = "Prep (Syncing Actions)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      console.log("Syncing Actions")
      let actionsSrc = path.join(currentDir, "AppData", "Actions")
      let actionsDes = path.join(projectFolder, "AppData", "Actions")
      fs.rmSync(actionsDes, { recursive: true, force: true })
      fs.cpSync(actionsSrc, actionsDes, { recursive: true, force: true, errorOnExist: false })
      try {
        options.burstInform(`✅ Actions Folder Synced`)
      } catch {}
    }

    if (initPageData.syncEvents == true || initPageData.removeUnusedEvents == true) {
      if (elementTab) {
        elementTab.innerHTML = "Prep (Syncing Events)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      console.log("Syncing Events")
      let eventsSrc = path.join(currentDir, "AppData", "Events")
      let eventsDes = path.join(projectFolder, "AppData", "Events")
      fs.rmSync(eventsDes, { recursive: true, force: true })
      fs.cpSync(eventsSrc, eventsDes, { recursive: true, force: true, errorOnExist: false })
      try {
        options.burstInform(`✅ Events Folder Synced`)
      } catch {}
    }

    let actionsUsed = new Set()
    let botCommands = botData.commands
    for (let command of botCommands) {
      findActionFiles(command).forEach((file) => actionsUsed.add(file))
    }

    if (initPageData.removeUnusedActions == true) {
      let removedCount = 0
      if (elementTab) {
        elementTab.innerHTML = "Prep (Removing Unused Actions)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      let actionsFolder = path.join(projectFolder, "AppData", "Actions")
      let actionFiles = fs.readdirSync(actionsFolder)
      for (action of actionFiles) {
        if (!actionsUsed.has(action) && fs.existsSync(path.join(actionsFolder, action))) {
          fs.rmSync(path.join(actionsFolder, action))
          removedCount++
        }
      }
      if (elementTab) {
        elementTab.innerHTML = `Prep (Removed ${removedCount} Unused Actions)`
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
    }

    if (initPageData.removeUnusedEvents == true) {
      let removedCount = 0
      if (elementTab) {
        elementTab.innerHTML = "Prep (Removing Unused Events)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      let eventsFolder = path.join(projectFolder, "AppData", "Events")
      let eventsFiles = fs.readdirSync(eventsFolder)
      for (event of eventsFiles) {
        if (!actionsUsed.has(event) && fs.existsSync(path.join(eventsFolder, event))) {
          fs.rmSync(path.join(eventsFolder, event))
          removedCount++
        }
      }
      if (elementTab) {
        elementTab.innerHTML = `Prep (Removed ${removedCount} Unused Events)`
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
    }

    if (initPageData.modifyRuntime == true) {
      if (elementTab) {
        elementTab.innerHTML = "Prep (Modifying Runtime Files...)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      fs.cpSync(path.join(process.cwd(), "bot.js"), path.join(projectFolder, "bot_original.js"))
      let prjSrcBotDataFile = path.join(projectFolder, "AppData", "data.json")
      let prjSrcBotData = JSON.parse(fs.readFileSync(prjSrcBotDataFile))
      prjSrcBotData.altPrjSrc = "."
      let prjBotFile = path.join(projectFolder, "bot.js")
      let botjsFileContent = fs.readFileSync(prjBotFile)
      let updatedBotjsFileContent = String(botjsFileContent).replaceAll("data.prjSrc", "data.altPrjSrc")
      fs.writeFileSync(prjSrcBotDataFile, JSON.stringify(prjSrcBotData, null, 2))
      fs.writeFileSync(prjBotFile, updatedBotjsFileContent)
      if (elementTab) {
        elementTab.innerHTML = "Prep (Modified Runtime Files...)"
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
    }

    if (elementTab) {
      elementTab.innerHTML = "Prep (Complete)"
      await new Promise((resolve) => setTimeout(resolve, 350))
      elementTab.innerHTML = "Prep"
    }
  },
}
