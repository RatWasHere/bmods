modVersion = "v1.2.1";
module.exports = {
  run: async (options) => {
    const fs = require("node:fs");
    const path = require("node:path");
    const os = require("node:os");

    let dataJSONPath = path.join(process.cwd(), "AppData", "data.json");
    let downloadsDir = path.join(os.homedir(), "Downloads");
    let automationDataJSONPath = path.join(process.cwd(), "Automations", "commandExIm", "preferences.json");
    if (!fs.existsSync(automationDataJSONPath)) {
      fs.mkdirSync(path.dirname(automationDataJSONPath), { recursive: true });
      let defaultDataStructure = {
        export: "",
      };
      fs.writeFileSync(automationDataJSONPath, JSON.stringify(defaultDataStructure, null, 2));
    }

    let automationPreferances = JSON.parse(fs.readFileSync(automationDataJSONPath));
    if (automationPreferances.export !== "" && automationPreferances.export !== "undefined") {
      downloadsDir = automationPreferances.export;
    }

    let titleCase = (string) =>
      string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    let commandTypes = {
      textCommand: "Text Cmd",
      slashCommand: "Slash Cmd",
      anyMessage: "Any Message",
      messageContent: "Message Content",
      message: "Message Cmd",
      user: "User Cmd",
      event: "Event",
    };

    let readAndPush = (fileLocation, commands) => {
      let rawCommandJson;
      try {
        rawCommandJson = fs.readFileSync(fileLocation, "utf8");
      } catch {
        // options.burstInform({ element: "text", text: titleCase(`⚠️ Could Not Read File ${fileLocation}`) });
        return false;
      }

      let commandJson;
      try {
        commandJson = JSON.parse(rawCommandJson);
      } catch {
        // options.burstInform({ element: "text", text: titleCase(`⚠️ ${fileLocation} Contains Invalid JSON`) });
        return false;
      }

      if (commandJson.name && commandJson.type && commandJson.trigger && commandJson.actions && commandJson.customId) {
      } else {
        // options.burstInform({ element: "text", text: titleCase(`⚠️ Command Validation Failed`) });
        return false;
      }

      if (Array.isArray(commandJson)) commands.push(...commandJson);
      else commands.push(commandJson);

      // options.burstInform({ element: "text", text: titleCase(`✅ Imported ${fileLocation}`) });
      return true;
    };

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
    ]);

    // =========================
    // EXPORT SECTION
    // =========================
    if (data.action.type === "export") {
      let botData = JSON.parse(fs.readFileSync(dataJSONPath));
      let commands = botData.commands;

      let defaultData = {
        exportPath: downloadsDir,
      };

      let exportUI = [];
      exportUI.push({
        element: "input",
        storeAs: "exportPath",
        name: "Export Path",
      });

      exportUI.push("_");

      exportUI.push({
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
      });

      exportUI.push("-");

      commands.forEach((command) => {
        exportUI.push({
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
        });
        exportUI.push("_");
      });

      options.showInterface(exportUI, defaultData).then((resultData) => {
        if (resultData.exportPath !== automationPreferances.export) {
          automationPreferances.export = path.normalize(resultData.exportPath);
          fs.writeFileSync(automationDataJSONPath, JSON.stringify(automationPreferances, null, 2));
        }

        let exportedCount = 0;
        downloadsDir = path.normalize(resultData.exportPath);
        delete resultData["exportPath"];
        let selectedIds = Object.keys(resultData).filter((k) => resultData[k]?.length);
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir, { recursive: true });
        }

        if (selectedIds.length === 0) return options.result(titleCase(`⚠️ No Commands Were Selected For Export`));

        for (let id of selectedIds) {
          let selectedData = resultData[id][0].data;
          let fileName = (selectedData.name || "Unnamed_Command").replace(/[^\w\-]+/g, "_");
          let exportPath = path.join(downloadsDir, `${fileName}.json`);

          fs.writeFileSync(exportPath, JSON.stringify(selectedData.data, null, 2));
          exportedCount++;
        }

        try {
          options.result(titleCase(`✅ Exported ${exportedCount} Command(s) To ${downloadsDir}`));
        } catch (err) {}
      });
    }

    // =========================
    // IMPORT SECTION
    // =========================
    else if (data.action.type === "import") {
      let botData = JSON.parse(fs.readFileSync(dataJSONPath));
      let commands = botData.commands;
      let defaultImportFolderPath = path.join(process.cwd(), "Automations", "commandExIm", "ImportCache");
      if (!fs.existsSync(defaultImportFolderPath)){
        fs.mkdirSync(defaultImportFolderPath, {recursive:true})
      }
      let defaultData = { path: defaultImportFolderPath, generateBackup: true };

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

              for (let file of files){

                if (!file.name.toLowerCase().endsWith('.json')){
                  logToConsole('Invalid File (Non-JSON): ' + file.name, '#ff0000')
                  continue
                }

                file.text().then(fileContent => {
                  try {
                    commandJSON = JSON.parse(fileContent)
                    if (commandJSON.name && commandJSON.type && commandJSON.trigger && commandJSON.actions && commandJSON.customId){
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
                  } catch (err) {logToConsole('Invalid File (Invalid JSON): ' + file.name, '#ff0000')}
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
          html:`
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
          `
        }
      ];

      options.showInterface(importUI, defaultData).then((resultData) => {
        let resultDataPath = resultData.path.replaceAll(`"`, "").replaceAll(`'`, "");
        let generateBackup = resultData.generateBackup;
        let commandsMerged = 0;

        if (generateBackup) {
          let projectDir = botData.prjSrc;
          let backupPath = path.join(projectDir, "backup_data.json");
          fs.writeFileSync(backupPath, JSON.stringify(botData, null, 2), "utf8");
          // options.burstInform({ element: "text", text: titleCase(`✅ Backup Saved To ${backupPath}`) });
        }

        let stats;
        try {
          stats = fs.statSync(resultDataPath);
        } catch {
          return options.result(titleCase(`⚠️ Path ${resultDataPath} Doesn't Exist`));
        }

        if (stats.isDirectory()) {
          let files = fs.readdirSync(resultDataPath);
          for (let file of files) {
            if (path.extname(file).toLowerCase() !== ".json") continue;
            let fileLocation = path.join(resultDataPath, file);
            if (readAndPush(fileLocation, commands)) commandsMerged++;
          }
        } else if (stats.isFile()) {
          if (readAndPush(resultDataPath, commands)) commandsMerged++;
        } else {
          return options.result(titleCase(`⚠️ ${resultDataPath} Is Neither A File Nor A Folder`));
        }

        botData.commands = commands;
        fs.writeFileSync(dataJSONPath, JSON.stringify(botData, null, 2), "utf8");
        fs.rm(defaultImportFolderPath, { recursive: true, force: true });

        try {
          options.result(titleCase(`✅ ${commandsMerged} Command(s) Imported Successfully, Reloading...`));
        } catch (err) {}

        if(commandsMerged > 0){
          setTimeout(() => location.reload(), 1000);
        }
      });
    }
  },
};

