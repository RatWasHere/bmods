modVersion = "v2.2.0";

module.exports = {
  data: {
    name: "Custom Data Top",
  },
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Allows you to create a leaderboard from custom json files!",
  },
  UI: [
    {
      element: "input",
      name: "Database",
      storeAs: "database",
    },
    "-",
    {
      element: "input",
      name: "Path",
      storeAs: "path",
      placeholder:
        "Not obligatory. Leave the field empty if you have objects coming at once and not in objects.",
    },
    "-",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Data Name",
      types: {
        options: "Data Name",
      },
      UItypes: {
        options: {
          name: "Data Name",
          inheritData: true,
          UI: [
            {
              element: "input",
              storeAs: "id",
              name: "Name (The name of the objects)",
            },
            {
              element: "menu",
              storeAs: "cases1",
              name: "Data Name",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Data Name",
                  preview: "`Query: ${option.data.name}`",
                  data: { name: "" },
                  UI: [
                    {
                      element: "input",
                      storeAs: "name",
                      name: "Name",
                    },
                    "-",
                    {
                      element: "toggle",
                      storeAs: "compile",
                      name: "Use it to compile",
                      true: "Yes!",
                      false: "Nono!",
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    "-",
    {
      element: "dropdown",
      name: "Result Type",
      storeAs: "resultType",
      choices: [
        { name: "All Results", value: "all results" },
        { name: "Top N Results", value: "top n results" },
        { name: "Bottom N Results", value: "bottom n results" },
        { name: "Range", value: "range" },
      ],
    },
    "_",
    {
      element: "inputGroup",
      nameSchemes: ["Start", "End"],
      storeAs: ["rangeStart", "rangeEnd"],
      placeholder: ["Start index (Lists Start At 0)", "End index"],
    },
    "_",
    {
      element: "dropdown",
      name: "Sort Order",
      storeAs: "sortOrder",
      choices: [
        { name: "Descending", value: "Descending" },
        { name: "Ascending", value: "Ascending" },
      ],
    },
    "-",
    {
      element: "dropdown",
      name: "Result Format Type",
      storeAs: "formatType",
      choices: [
        { name: "The created array is top", value: "array" },
        { name: "Custom text as a list", value: "сustom" },
      ],
    },
    "_",
    {
      element: "input",
      name: "Result Format",
      storeAs: "resultFormat",
      placeholder: "Example: ID: ${id} - Data: ${DataValue}",
    },
    "_",
    {
      element: "storage",
      storeAs: "store",
      name: "Store List As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (values, constants) => {
    const checkAndCount = (arr) => (Array.isArray(arr) ? arr.length : 0);
    let numData = checkAndCount(values.cases);

    return `Database: ${
      values.database
    } - Data Name: ${numData} - Store As: ${constants.variable(values.store)}`;
  },
  compatibility: ["Any"],

  script: (data) => {
    const fs = require('fs');
    const path = require('path');
    const { clipboard } = require('electron');
    let directoryHistory = [];
    let initialInterfaceElements = [];
    
    function getProjectDirectory() {
      const botData = require("../data.json");
      const currentDir = process.cwd().replace(/\\/g, "/");
      return currentDir.includes("common/Bot Maker For Discord") 
        ? botData.prjSrc.replace(/\\/g, "/") 
        : currentDir;
    }
    
    function readDirectory(directoryPath) {
      try {
        const items = fs.readdirSync(directoryPath, { withFileTypes: true });
        return items
          .filter(item => item.isDirectory() || path.extname(item.name).toLowerCase() === ".json")
          .map(item => ({
            name: item.name,
            isDirectory: item.isDirectory()
          }));
      } catch (error) {
        alert(`Failed to read directory: ${directoryPath}`);
        return [];
      }
    }
    
    function displayDirectoryContents(directoryPath) {
      const items = readDirectory(directoryPath);
      const editorContent = data.document.getElementById("editorContent");
      while (editorContent.firstChild) editorContent.removeChild(editorContent.firstChild);
    
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "10px";
      buttonContainer.style.marginTop = "15px";
      buttonContainer.style.marginBottom = "15px";
      buttonContainer.style.alignItems = "center";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.width = "100%";
    
      function createStyledButton(text, handler) {
        const btn = document.createElement("div");
        btn.className = "hoverablez";
        btn.textContent = text;
        btn.style.padding = "8px 15px";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "13px";
        btn.style.textAlign = "center";
        btn.style.backgroundColor = "#333";
        btn.style.color = "#fff";
        btn.style.minWidth = "70px";
        btn.onclick = handler;
        return btn;
      }
    
      const backButton = createStyledButton("Back", () => {
        if (directoryHistory.length > 1) {
          directoryHistory.pop();
          displayDirectoryContents(directoryHistory[directoryHistory.length - 1]);
        } else {
          directoryHistory = [];
          displayInitialMenu();
        }
      });
    
      let selectedItem = null;
    
      if (directoryHistory.length > 0) {
        const relativePath = path.relative(getProjectDirectory(), directoryPath).replace(/\\/g, "/");
        if (relativePath && relativePath.trim() !== "") {
          selectedItem = {
            name: path.basename(directoryPath),
            isDirectory: true,
            fullPath: directoryPath,
            relativePath: relativePath
          };
        }
      }
    
      const copyPathButton = createStyledButton("Copy Path", () => {
        if (selectedItem && selectedItem.relativePath && selectedItem.relativePath.trim() !== "") {
          clipboard.writeText(selectedItem.relativePath);
          alert(`Copied: ${selectedItem.relativePath}`);
        } else {
          alert("Cannot copy empty path.");
        }
      });
    
      copyPathButton.disabled = !selectedItem || !selectedItem.relativePath || selectedItem.relativePath.trim() === "";
    
      buttonContainer.appendChild(backButton);
      buttonContainer.appendChild(copyPathButton);
    
      const title = document.createElement("div");
      title.textContent = `Contents of: ${directoryPath}`;
      title.style.fontWeight = "bold";
      title.style.marginBottom = "10px";
    
      const selectionMessage = document.createElement("div");
      selectionMessage.id = "selectionMessage";
      selectionMessage.style.marginBottom = "10px";
      selectionMessage.style.fontStyle = "italic";
      selectionMessage.style.display = "none";
    
      const list = document.createElement("ul");
      list.style.listStyleType = "none";
      list.style.padding = "0";
    
      items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item.isDirectory 
          ? `[Folder] ${item.name}` 
          : `[File] ${item.name}`;
        listItem.style.marginBottom = "5px";
        listItem.style.cursor = "pointer";
        listItem.classList.add("hoverablez");
    
        const fullPath = path.join(directoryPath, item.name);
        const relativePath = path.relative(getProjectDirectory(), fullPath).replace(/\\/g, "/");
        
        listItem.onclick = () => {
          if (!item.isDirectory) {
            if (relativePath && relativePath.trim() !== "") {
              selectedItem = {
                name: item.name,
                isDirectory: false,
                fullPath,
                relativePath
              };
              copyPathButton.disabled = false;
              selectionMessage.textContent = `File selected: ${item.name}`;
              selectionMessage.style.display = "block";
            } else {
              selectedItem = null;
              copyPathButton.disabled = true;
              selectionMessage.style.display = "none";
            }
          } else {
            if (relativePath && relativePath.trim() !== "") {
              selectedItem = {
                name: item.name,
                isDirectory: true,
                fullPath,
                relativePath
              };
              copyPathButton.disabled = false;
              selectionMessage.style.display = "none";
            } else {
              selectedItem = null;
              copyPathButton.disabled = true;
              selectionMessage.style.display = "none";
            }
    
            directoryHistory.push(fullPath);
            displayDirectoryContents(fullPath);
          }
        };
        list.appendChild(listItem);
      });
    
      if (directoryHistory.length > 0) {
        editorContent.appendChild(buttonContainer);
      }
      editorContent.appendChild(title);
      editorContent.appendChild(selectionMessage);
      editorContent.appendChild(list);
    }
    
    function displayInitialMenu() {
      const editorContent = data.document.getElementById("editorContent");
      while (editorContent.firstChild) editorContent.removeChild(editorContent.firstChild);
      
      initialInterfaceElements.forEach(element => {
        const clone = element.cloneNode(false);
        clone.innerHTML = element.innerHTML;
        editorContent.appendChild(clone);
      });
    
      if (!document.querySelector('.project-files-button')) {
        const projectButton = createProjectFilesButton();
        editorContent.appendChild(projectButton);
      }
    }

    function createProjectFilesButton() {
      const button = document.createElement("div");
      button.className = 'project-files-button';
      button.innerHTML = `
        <div class="hoverablez" style="
          position: absolute;
          top: 70px;
          right: 10px;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          max-width: 150px;
          white-space: nowrap;
          z-index: 1000;
        ">
          Show Project Files
        </div>
      `;
      button.onclick = () => {
        const projectDir = getProjectDirectory();
        directoryHistory.push(projectDir);
        displayDirectoryContents(projectDir);
      };
      return button;
    }
    
    setTimeout(() => {
      const editorContent = data.document.getElementById("editorContent");
      if (!editorContent) return;
  
      const initialChildren = Array.from(editorContent.children).map(el => {
        const clone = document.createElement(el.tagName);
        for (let attr of el.attributes) {
          if (attr.name !== 'value') {
            clone.setAttribute(attr.name, attr.value);
          }
        }
        clone.innerHTML = el.innerHTML;
        return clone;
      });
      initialInterfaceElements = initialChildren;
  
      const projectButton = createProjectFilesButton();
      editorContent.appendChild(projectButton);
    }, 0);
  },

  run(values, message, client, bridge) {
    let fs = bridge.fs;

    if (!values.database) {
      console.error(
        "Error: The path to the database (Database) is not defined."
      );
      return;
    }

    const botData = require("../data.json");
    let dbPath = bridge.transf(values.database);
    const currentDir = process.cwd().replace(/\\/g, "/");

    if (currentDir.includes("common/Bot Maker For Discord")) {
      dbPath = botData.prjSrc + `/` + dbPath;
      var fullPath = dbPath.replace(/\\/g, "/");
    } else {
      var fullPath = `${currentDir}/${dbPath}`.replace(/\\/g, "/");
    }

    const dirPath = fullPath.split("/").slice(0, -1).join("/");

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, "{}", "utf8");
    }

    if (values.deleteJson) {
      fs.writeFileSync(fullPath, "{}", "utf8");
    }

    let data = fs.readFileSync(fullPath, "utf8");
    let jsonObject = JSON.parse(data);
    let dataList = [];

    const nameidobject = bridge.transf(values.id);

    const additionalFields = [];
    if (Array.isArray(values.cases1)) {
      for (const dataCase of values.cases1) {
        const name = bridge.transf(dataCase.data.name);
        const compile = dataCase.data.compile;

        additionalFields.push({ name, compile });
      }
    }

    const path = values.path ? bridge.transf(values.path) : null;

    if (path) {
      const pathParts = path.split(".");
      let current = jsonObject;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];

        if (
          /\[\d+\]$/.test(part) ||
          part.endsWith("[N]") ||
          part.endsWith("[^]")
        ) {
          const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
          if (!arrayKeyMatch) {
            current = undefined;
            break;
          }
          const arrayKey = arrayKeyMatch[1];
          const indexOrSymbol = arrayKeyMatch[2];
          if (!Array.isArray(current[arrayKey])) {
            current = undefined;
            break;
          }
          const array = current[arrayKey];
          if (indexOrSymbol === "N" || indexOrSymbol === "^") {
            current = array[array.length - 1];
          } else {
            const index = parseInt(indexOrSymbol, 10);
            if (isNaN(index) || index < 0 || index >= array.length) {
              current = undefined;
              break;
            }
            current = array[index];
          }
        } else {
          if (!current || typeof current !== "object") {
            current = undefined;
            break;
          }
          current = current[part];
        }

        if (current === undefined) {
          break;
        }
      }

      if (current && Array.isArray(current)) {
        current.forEach((item, index) => {
          const entry = { [nameidobject]: item[nameidobject] || index };

          const mainValue = item[bridge.transf(values.dataName)];
          if (mainValue !== undefined) {
            entry[bridge.transf(values.dataName)] = mainValue;
          }

          additionalFields.forEach(({ name, compile }) => {
            const fieldValue = item[name];
            if (fieldValue !== undefined) {
              entry[name] = fieldValue;

              if (compile) {
                entry.SortValue = fieldValue;
              }
            }
          });

          dataList.push(entry);
        });
      } else if (current && typeof current === "object") {
        for (let key in current) {
          const item = current[key];
          const entry = { [nameidobject]: item[nameidobject] || key };

          const mainValue = item[bridge.transf(values.dataName)];
          if (mainValue !== undefined) {
            entry[bridge.transf(values.dataName)] = mainValue;
          }

          additionalFields.forEach(({ name, compile }) => {
            const fieldValue = item[name];
            if (fieldValue !== undefined) {
              entry[name] = fieldValue;

              if (compile) {
                entry.SortValue = fieldValue;
              }
            }
          });

          dataList.push(entry);
        }
      }
    } else {
      for (let key in jsonObject) {
        const item = jsonObject[key];
        const entry = { [nameidobject]: item[nameidobject] || key };

        const mainValue = item[bridge.transf(values.dataName)];
        if (mainValue !== undefined) {
          entry[bridge.transf(values.dataName)] = mainValue;
        }

        additionalFields.forEach(({ name, compile }) => {
          const fieldValue = item[name];
          if (fieldValue !== undefined) {
            entry[name] = fieldValue;

            if (compile) {
              entry.SortValue = fieldValue;
            }
          }
        });

        dataList.push(entry);
      }
    }

    if (dataList.length === 0) return;

    dataList.sort((a, b) => {
      const aValue =
        a.SortValue !== undefined
          ? parseInt(a.SortValue, 10)
          : parseInt(a[bridge.transf(values.dataName)], 10);
      const bValue =
        b.SortValue !== undefined
          ? parseInt(b.SortValue, 10)
          : parseInt(b[bridge.transf(values.dataName)], 10);
      return values.sortOrder === "Ascending"
        ? aValue - bValue
        : bValue - aValue;
    });

    let filteredDataList;
    const resultType = values.resultType.toLowerCase();
    switch (resultType) {
      case "top n results":
        const topN = Number(bridge.transf(values.rangeStart));
        if (topN > 0) filteredDataList = dataList.slice(0, topN);
        break;
      case "bottom n results":
        const bottomN = Number(bridge.transf(values.rangeEnd));
        if (bottomN > 0) filteredDataList = dataList.slice(-bottomN);
        break;
      case "range":
        const rangeStart = Number(bridge.transf(values.rangeStart));
        const rangeEnd = Number(bridge.transf(values.rangeEnd));
        filteredDataList = dataList.slice(rangeStart, rangeEnd);
        break;
      case "all results":
        filteredDataList = dataList;
        break;
    }

    if (filteredDataList) {
      const formatType = values.formatType.toLowerCase();
      switch (formatType) {
        case "the created array is top":
          bridge.store(values.store, filteredDataList);
          break;

        case "custom text as a list":
          const formattedResult = filteredDataList
            .map((item) => {
              let resultString = values.resultFormat;

              resultString = resultString.replace(
                /\$\{([^}]+)\}/g,
                (_, content) => {
                  if (/[+\-*/]/.test(content)) {
                    const replacedExpr = content.replace(
                      /([а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9\s]*)/g,
                      (match) => {
                        const key = match.trim();
                        return Number(item[key] || 0);
                      }
                    );

                    try {
                      return new Function(`return (${replacedExpr})`)();
                    } catch {
                      return 0;
                    }
                  } else {
                    return item[content.trim()] || "";
                  }
                }
              );

              return resultString;
            })
            .join(",");
          bridge.store(values.store, bridge.transf(formattedResult).split(","));
          break;
      }
    }
  },
};
