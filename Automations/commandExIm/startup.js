module.exports = {
  run: (options) => {
    const fs = require("node:fs")
    const path = require("node:path")
    const { shell } = require("electron")

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

    let titleCase = (string) =>
      string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    if (options.result) {
      let element = document.createElement("div")
      element.classList = "hoverablez option"
      element.innerHTML = `Export/Import`
      element.onclick = () => {
        options.eval('runAutomation("commandExIm")')
      }
      element.id = "commandExImQA"

      let elementAnchor = document.getElementById("collaborationStatus")

      element.appendAfter(elementAnchor)

      let commandBar = document.getElementById("commandbar")

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

      commandBar.addEventListener("dragover", (event) => {
        event.preventDefault()
      })

      commandBar.addEventListener("dragleave", () => {})

      commandBar.addEventListener("drop", async (event) => {
        event.preventDefault()
        if (event.dataTransfer.files.length == 0) {
          return
        }
        let dataJSONPath = path.join(process.cwd(), "AppData", "data.json")
        let preferenceFilePath = path.join(process.cwd(), "Automations", "commandExIm", "preferences.json")
        let botData = JSON.parse(fs.readFileSync(dataJSONPath))
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
        fs.writeFileSync(dataJSONPath, JSON.stringify(botData, null, 2), "utf8")

        if (importCount > 0) {
          if (!fs.existsSync(preferenceFilePath)) {
            fs.mkdirSync(path.dirname(preferenceFilePath), { recursive: true })
            let defaultDataStructure = {
              export: "",
              importDnD: 0,
            }
            fs.writeFileSync(preferenceFilePath, JSON.stringify(defaultDataStructure, null, 2))
          }
          let preferencesRaw = fs.readFileSync(preferenceFilePath)
          let preferences = JSON.parse(preferencesRaw)
          preferences.importDnD = (Number(preferences.importDnD) || 0) + importCount
          if (preferences.importDnD >= 10 && !preferences.donoPopup) {
            preferences.importDnD = Number(preferences.importDnD) % 10
            await showDonatePopup()
          }
          fs.writeFileSync(preferenceFilePath, JSON.stringify(preferences, null, 2))
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
  },
}
