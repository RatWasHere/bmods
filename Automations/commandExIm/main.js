modVersion = "v1.0.0";
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

    let titleCase = (string) => string.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    let readAndPush = (fileLocation) => {
      let rawCommandJson;
      try {
        rawCommandJson = fs.readFileSync(fileLocation, "utf8");
      } catch {
        options.burstInform({ element: "text", text: titleCase(`⚠️ Could Not Read File ${fileLocation}`) });
        return false;
      }

      let commandJson;
      try {
        commandJson = JSON.parse(rawCommandJson);
      } catch {
        options.burstInform({ element: "text", text: titleCase(`⚠️ ${fileLocation} Contains Invalid JSON`) });
        return false;
      }

      if (commandJson.name && commandJson.type && commandJson.trigger && commandJson.actions && commandJson.customId) {
      } else {
        options.burstInform({ element: "text", text: titleCase(`⚠️ Command Validation Failed`) });
        return false;
      }

      if (Array.isArray(commandJson)) commands.push(...commandJson);
      else commands.push(commandJson);

      options.burstInform({ element: "text", text: titleCase(`✅ Imported ${fileLocation}`) });
      return true;
    };

    let commandTypes = {
      textCommand: "Text Cmd",
      slashCommand: "Slash Cmd",
      anyMessage: "Any Message",
      messageContent: "Message Content",
      message: "Message Cmd",
      user: "User Cmd",
      event: "Event",
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
            style="width: fit-content; margin-left: auto; margin-right: auto"
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

        options.result(titleCase(`✅ Exported ${exportedCount} Command(s) To ${downloadsDir}`));
      });
    }

    // =========================
    // IMPORT SECTION
    // =========================
    else if (data.action.type === "import") {
      let botData = JSON.parse(fs.readFileSync(dataJSONPath));
      let commands = botData.commands;
      let defaultData = { path: "", generateBackup: true };

      let importUI = [
        {
          element: "input",
          storeAs: "path",
          name: "Path Of File / Folder",
          placeholder: "C:\\Path\\To\\file.json | C:\\Path\\To\\JSONfolder",
        },
        "-",
        {
          element: "toggle",
          storeAs: "generateBackup",
          name: "Generate Backup?",
        },
      ];

      options.showInterface(importUI, defaultData).then((resultData) => {
        let resultDataPath = resultData.path.replaceAll(`"`, "").replaceAll(`'`, "");
        let generateBackup = resultData.generateBackup;
        let commandsMerged = 0;

        if (generateBackup) {
          let projectDir = botData.prjSrc;
          let backupPath = path.join(projectDir, "backup_data.json");
          fs.writeFileSync(backupPath, JSON.stringify(botData, null, 2), "utf8");
          options.burstInform({ element: "text", text: titleCase(`✅ Backup Saved To ${backupPath}`) });
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
            if (readAndPush(fileLocation)) commandsMerged++;
          }
        } else if (stats.isFile()) {
          if (readAndPush(resultDataPath)) commandsMerged++;
        } else {
          return options.result(titleCase(`⚠️ ${resultDataPath} Is Neither A File Nor A Folder`));
        }

        botData.commands = commands;
        fs.writeFileSync(dataJSONPath, JSON.stringify(botData, null, 2), "utf8");

        options.result(titleCase(`✅ ${commandsMerged} Command(s) Imported Successfully, Reloading...`));
        setTimeout(() => location.reload(), 1000);
      });
    }
  },
};
