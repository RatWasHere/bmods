modVersion = "v2.1.0";

module.exports = {
  data: {
    name: "Check Custom Data",
  },
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Allows you to check custom json files!",
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
      storeAs: "Path",
      name: "Path",
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "comparator",
      extraField: "compareValue",
      name: "Comparison Type",
      choices: [
        {
          name: "Equals",
          field: true,
          placeholder: "Equals To",
        },
        {
          name: "Equals Exactly",
          field: true,
        },
        {
          name: "Doesn't Equal",
          field: true,
        },
        {
          name: "Exists",
        },
        {
          name: "Less Than",
          field: true,
        },
        {
          name: "Greater Than",
          field: true,
        },
        {
          name: "Equal Or Less Than",
          field: true,
        },
        {
          name: "Equal Or Greater Than",
          field: true,
        },
        {
          name: "Is Number",
        },
        {
          name: "Matches Regex",
          field: true,
          placeholder: "Regex",
        },
        {
          name: "Exactly includes",
          field: true,
          placeholder: "Text",
        },
      ],
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

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

  subtitle: (data, constants) => {
    let variable = data.Path;

    switch (data.comparator) {
      case "Equals":
        return `${variable} Equals ${data.compareValue}`;
        break;

      case "Equals Exactly":
        return `${variable} Equals ${data.compareValue}`;
        break;

      case "Doesn't Equal":
        return `${variable} Doesn't Equal ${data.compareValue}`;
        break;

      case "Exists":
        return `${variable} Exists`;
        break;

      case "Less Than":
        return `${variable} Is Less Than ${data.compareValue}`;
        break;

      case "Greater Than":
        return `${variable} Is Greater Than ${data.compareValue}`;
        break;

      case "Equal Or Less Than":
        return `${variable} Is Equal Or Less Than ${data.compareValue}`;
        break;

      case "Equal Or Greater Than":
        return `${variable} Is Equal Or Greater Than ${data.compareValue}`;
        break;

      case "Is Number":
        return `${variable} Is A Number`;
        break;

      case "Matches Regex":
        return `${variable} Matches Regex (${data.compareValue})`;
        break;

      case "Exactly includes":
        return `${variable} Exactly includes (${data.compareValue})`;
        break;
    }
  },

  async run(values, message, client, bridge) {
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

    let data = {};
    let matchesCriteria = false;

    if (fs.existsSync(fullPath)) {
      try {
        const rawData = fs.readFileSync(fullPath, "utf8");
        data = JSON.parse(rawData);

        const path = bridge.transf(values.Path);
        const pathParts = path.split(".");
        let variable = data;

        for (const part of pathParts) {
          if (
            /\[\d+\]$/.test(part) ||
            part.endsWith("[N]") ||
            part.endsWith("[^]")
          ) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
            if (!arrayKeyMatch) {
              variable = undefined;
              break;
            }

            const arrayKey = arrayKeyMatch[1];
            const indexOrSymbol = arrayKeyMatch[2];

            if (!Array.isArray(variable[arrayKey])) {
              variable = undefined;
              break;
            }

            const array = variable[arrayKey];

            if (indexOrSymbol === "N" || indexOrSymbol === "^") {
              variable = array[array.length - 1];
            } else {
              const index = parseInt(indexOrSymbol, 10);
              if (isNaN(index) || index < 0 || index >= array.length) {
                variable = undefined;
                break;
              }
              variable = array[index];
            }
          } else {
            if (!variable || typeof variable !== "object") {
              variable = undefined;
              break;
            }
            variable = variable[part];
          }

          if (variable === undefined) {
            break;
          }
        }

        let secondValue = bridge.transf(values.compareValue);

        switch (values.comparator) {
          case "Equals":
            if (`${variable}` == `${secondValue}`) {
              matchesCriteria = true;
            }
            break;
          case "Doesn't Equal":
            if (variable != secondValue) {
              matchesCriteria = true;
            }
            break;
          case "Exists":
            matchesCriteria = variable != null && variable !== undefined;
            break;
          case "Equals Exactly":
            if (variable === secondValue) {
              matchesCriteria = true;
            }
            break;
          case "Greater Than":
            if (Number(variable) > Number(secondValue)) {
              matchesCriteria = true;
            }
            break;
          case "Less Than":
            if (Number(variable) < Number(secondValue)) {
              matchesCriteria = true;
            }
            break;
          case "Equal Or Greater Than":
            if (Number(variable) >= Number(secondValue)) {
              matchesCriteria = true;
            }
            break;
          case "Equal Or Less Than":
            if (Number(variable) <= Number(secondValue)) {
              matchesCriteria = true;
            }
            break;
          case "Is Number":
            if (
              typeof parseInt(variable) === "number" &&
              !isNaN(parseInt(variable))
            ) {
              matchesCriteria = true;
            }
            break;
          case "Matches Regex":
            try {
              matchesCriteria = Boolean(
                variable?.toString().match(new RegExp(`^${secondValue}$`, "i"))
              );
            } catch (error) {
              matchesCriteria = false;
            }
            break;
          case "Exactly includes":
            if (typeof variable?.toString().includes === "function") {
              matchesCriteria = variable.toString().includes(secondValue);
            }
            break;
        }
      } catch (error) {
        console.error("Ошибка при чтении или обработке данных:", error);
      }
    }

    if (matchesCriteria) {
      bridge.call(values.true, values.trueActions);
    } else {
      bridge.call(values.false, values.falseActions);
    }
  },
};
