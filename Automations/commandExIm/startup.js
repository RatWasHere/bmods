module.exports = {
  run: (options) => {
    const fs = require("node:fs")
    const path = require("node:path")

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

      let originalClr = commandBar.style.borderColor

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
        commandBar.style.borderColor = "#00b4d8"
      })

      commandBar.addEventListener("dragleave", () => {
        commandBar.style.borderColor = originalClr
      })

      commandBar.addEventListener("drop", async (event) => {
        if (event.dataTransfer.files.length == 0) {
          return
        }
        let dataJSONPath = path.join(process.cwd(), "AppData", "data.json")
        let botData = JSON.parse(fs.readFileSync(dataJSONPath))
        let commands = botData.commands
        event.preventDefault()
        commandBar.style.borderColor = originalClr
        let files = Array.from(event.dataTransfer.files)
        let importCount = 0
        let jsonFiles = files.filter((f) => f.name.toLowerCase().endsWith(".json"))

        await Promise.all(
          jsonFiles.map(async (file) => {
            try {
              const fileContent = await file.text()
              const commandJSON = JSON.parse(fileContent)
              if (validateCmdJSON(commandJSON)) {
                commands.push(commandJSON)
                importCount++
              } else {
                console.log(`Invalid Command JSON in ${file.name}`)
              }
            } catch (err) {
              console.log(`Failed to parse ${file.name}:`, err)
            }
          }),
        )
        botData.commands = commands
        fs.writeFileSync(dataJSONPath, JSON.stringify(botData, null, 2), "utf8")

        if (importCount > 0) {
          try {
            options.result(titleCase(`✅ ${importCount} Command(s) Imported Successfully, Reloading...`))
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
