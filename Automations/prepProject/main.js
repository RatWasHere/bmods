modVersion = "v1.1.0"
module.exports = {
  run: async (options) => {
    const fs = require("node:fs")
    const path = require("node:path")
    const os = require("node:os")
    const https = require("node:https")

    let dataJSONPath = path.join(process.cwd(), "AppData", "data.json")
    let botData = JSON.parse(fs.readFileSync(dataJSONPath))
    let projectFolder = botData.prjSrc

    let initPageDefaultData = {
      downloadScripts: true,
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
        "-",
        {
          element: "text",
          text: modVersion,
        },
      ],
      initPageDefaultData,
    )

    let elementTab = document.getElementById("prepProjectQA")
    if (initPageData.downloadScripts == true) {
      switch (initPageData.environment.type) {
        case "windows": {
          try {
            console.log("Downloading Scripts")
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloading Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
            let scriptFilePath = path.join(projectFolder, "start.bat")
            let persistScriptFilePath = path.join(projectFolder, "start_persist.bat")

            let startScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/start.bat`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/start_persist.bat`, { method: "GET" })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            try {
              options.burstInform(`✅ Start Scripts Downloaded`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloaded Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          } catch (err) {
            try {
              options.burstInform(`⚠️ Something Went Wrong...`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Something Went Wrong...)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          }
          break
        }

        case "linux": {
          try {
            console.log("Downloading Scripts")
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloading Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }

            let scriptFilePath = path.join(projectFolder, "start.sh")
            let persistScriptFilePath = path.join(projectFolder, "start_persist.sh")

            let startScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/prep/linux/start.sh`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/prep/linux/start_persist.sh`, {
              method: "GET",
            })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            fs.chmodSync(scriptFilePath, 0o755)
            fs.chmodSync(persistScriptFilePath, 0o755)
            try {
              options.burstInform(`✅ Start Scripts Downloaded`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloaded Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          } catch (err) {
            try {
              options.burstInform(`⚠️ Something Went Wrong...`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Something Went Wrong...)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          }
          break
        }

        case "macos": {
          try {
            console.log("Downloading Scripts")
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloading Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }

            let scriptFilePath = path.join(projectFolder, "start.command")
            let persistScriptFilePath = path.join(projectFolder, "start_persist.command")

            let startScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/prep/mac/start.sh`, { method: "GET" })
            let startPersistScript = await fetch(`https://github.com/slothyace/bmods-ace/raw/refs/heads/main/Scripts/prep/mac/start_persist.sh`, {
              method: "GET",
            })
            let startScriptText = await startScript.text()
            let persistScriptText = await startPersistScript.text()

            fs.writeFileSync(scriptFilePath, startScriptText)
            fs.writeFileSync(persistScriptFilePath, persistScriptText)
            fs.chmodSync(scriptFilePath, 0o755)
            fs.chmodSync(persistScriptFilePath, 0o755)
            try {
              options.burstInform(`✅ Start Scripts Downloaded`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Downloaded Scripts)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          } catch (err) {
            try {
              options.burstInform(`⚠️ Something Went Wrong...`)
            } catch {}
            if (elementTab) {
              elementTab.innerHTML = "Prep (Something Went Wrong...)"
              await new Promise((resolve) => setTimeout(resolve, 350))
            }
          }
          break
        }
      }
    }

    if (elementTab) {
      elementTab.innerHTML = "Prep (Checking For storedData.json)"
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
    let storedDataPath = path.join(projectFolder, "AppData", "Toolkit", "storedData.json")
    if (!fs.existsSync(storedDataPath)) {
      console.log("Creating Default storedData.json")
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
    if (initPageData.syncActions == true) {
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

    if (initPageData.syncEvents == true) {
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

    if (elementTab) {
      elementTab.innerHTML = "Prep (Complete)"
      setTimeout(() => {
        elementTab.innerHTML = "Prep"
      }, 500)
    }
  },
}
