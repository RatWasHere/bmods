modVersion = "v1.0.0";
module.exports = {
  run: async (options) => {
    const fs = require("node:fs");
    const path = require("node:path");
    const os = require("node:os");

    const dataJSONPath = path.join(process.cwd(), "AppData", "data.json");
    const botData = require(dataJSONPath);
    const commands = botData.commands;
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

    const titleCase = (string) =>
      string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const commandTypes = {
      textCommand: "Text Cmd",
      slashCommand: "Slash Cmd",
      anyMessage: "Any Message",
      messageContent: "Message Content",
      message: "Message Cmd",
      user: "User Cmd",
      event: "Event",
    };

    const data = await options.showInterface([
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
        const selectedIds = Object.keys(resultData).filter((k) => resultData[k]?.length);
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir, { recursive: true });
        }

        if (selectedIds.length === 0) return options.result(titleCase(`⚠️ No Commands Were Selected For Export`));

        for (const id of selectedIds) {
          const selectedData = resultData[id][0].data;
          const fileName = (selectedData.name || "Unnamed_Command").replace(/[^\w\-]+/g, "_");
          const exportPath = path.join(downloadsDir, `${fileName}.json`);

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
      let defaultData = { path: "", generateBackup: true };

      let importUI = [
        {
          element: "input",
          storeAs: "path",
          name: "Path Of File / Folder",
          placeholder: "C:\\Path\\To\\file.json | C:\\Path\\To\\JSONfolder",
        },
        // "_",
        // {
        //   element: "html",
        //   html: `
        //     <div
        //     id="dropArea"
        //     style="width: fit-content; margin-left: auto; margin-right: auto; padding: 20px;border: 2px dashed #555;border-radius: 6px;text-align: center;"
        //     class="hoverablez flexbox"
        //     ondragover="event.preventDefault(); this.style.borderColor='#00b4d8';"
        //     ondragleave="this.style.borderColor='#555';"
        //     ondrop="
        //       event.preventDefault();
        //       this.style.borderColor='#555';
        //       const file = event.dataTransfer.files[0];
        //       console.log(file)
        //       if (!file || !file.path) return;
        //       const filePath = file.path;
        //       if (!filePath.endsWith('.json') && !file.type && !file.isDirectory) {
        //         alert('Only JSON Files Or Folders Are Allowed.');
        //         return;
        //       }
        //       const inputArea = document.getElementById('path');
        //       inputArea.value = filePath;
        //       inputArea.focus();
        //     "
        //   >
        //     Drop a JSON file or folder here
        //   </div>
        //     `,
        // },
        "-",
        {
          element: "toggle",
          storeAs: "generateBackup",
          name: "Generate Backup?",
        },
      ];

      // Helper to read and merge one file
      const readAndPush = (fileLocation) => {
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

        if (
          commandJson.name &&
          commandJson.type &&
          commandJson.trigger &&
          commandJson.actions &&
          commandJson.customId
        ) {
        } else {
          options.burstInform({ element: "text", text: titleCase(`⚠️ Command Validation Failed`) });
          return false;
        }

        if (Array.isArray(commandJson)) commands.push(...commandJson);
        else commands.push(commandJson);

        options.burstInform({ element: "text", text: titleCase(`✅ Imported ${fileLocation}`) });
        return true;
      };

      options.showInterface(importUI, defaultData).then((resultData) => {
        const resultDataPath = resultData.path.replaceAll(`"`, "").replaceAll(`'`, "");
        const generateBackup = resultData.generateBackup;
        let commandsMerged = 0;

        // Backup first if requested
        if (generateBackup) {
          const projectDir = botData.prjSrc;
          const backupPath = path.join(projectDir, "backup_data.json");
          fs.writeFileSync(backupPath, JSON.stringify(botData, null, 2), "utf8");
          options.burstInform({ element: "text", text: titleCase(`✅ Backup Saved To ${backupPath}`) });
        }

        // Validate target path
        let stats;
        try {
          stats = fs.statSync(resultDataPath);
        } catch {
          return options.result(titleCase(`⚠️ Path ${resultDataPath} Doesn't Exist`));
        }

        // Merge based on type
        if (stats.isDirectory()) {
          const files = fs.readdirSync(resultDataPath);
          for (const file of files) {
            if (path.extname(file).toLowerCase() !== ".json") continue;
            const fileLocation = path.join(resultDataPath, file);
            if (readAndPush(fileLocation)) commandsMerged++;
          }
        } else if (stats.isFile()) {
          if (readAndPush(resultDataPath)) commandsMerged++;
        } else {
          return options.result(titleCase(`⚠️ ${resultDataPath} Is Neither A File Nor A Folder`));
        }

        // Save merged data
        botData.commands = commands;
        fs.writeFileSync(dataJSONPath, JSON.stringify(botData, null, 2), "utf8");

        options.result(titleCase(`✅ ${commandsMerged} Command(s) Imported Successfully, Reloading...`));
        setTimeout(() => location.reload(), 1000);
      });
    }
  },
};
