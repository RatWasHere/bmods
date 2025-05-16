modVersion = "v2.3.2";

module.exports = {
  data: {
    name: "Store Custom Data",
    database: "",
  },
  aliases: [
    "Get Custom Data",
    "Get Json Data",
    "Store Json Data",
  ],
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Allows you to get information from custom json files!",
  },
  UI: [
    {
      element: "input",
      name: "Database",
      storeAs: "database",
    },
    "-",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Store Data",
      types: {
        options: "Store Data",
      },
      UItypes: {
        options: {
          name: "Store Data",
          inheritData: true,
          UI: [
            {
              element: "menu",
              storeAs: "cases",
              name: "Store Data",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Store Data",
                  preview: "`Path: ${option.data.Path}`",
                  data: { Path: "" },
                  UI: [
                    {
                      element: "input",
                      storeAs: "Path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "store",
                      storeAs: "store",
                      name: "Store As",
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
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Store list Data",
      types: {
        options: "Store list Data",
      },
      UItypes: {
        options: {
          name: "Store list Data",
          inheritData: true,
          UI: [
            {
              element: "menu",
              storeAs: "cases1",
              name: "Store list Data",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Store list Data",
                  preview: "`Path: ${option.data.Path}`",
                  data: { Path: "" },
                  UI: [
                    {
                      element: "input",
                      storeAs: "Path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "toggleGroup",
                      storeAs: ["objects", "lines"],
                      nameSchemes: ["Exclude objects", "Exclude lines"],
                    },
                    "-",
                    {
                      element: "store",
                      storeAs: "store",
                      name: "Store As",
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
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Search through array",
      types: {
        options: "Search through array",
      },
      UItypes: {
        options: {
          name: "Search through array",
          inheritData: true,
          UI: [
            {
              element: "menu",
              storeAs: "cases2",
              name: "Search through array",
              types: {
                value: "Search through array Value",
                object: "Search through array Value in an object",
              },
              max: 200,
              UItypes: {
                value: {
                  name: "Search through array Value",
                  preview:
                    "`Query: ${option.data.Path} - ${option.data.value}`",
                  data: { Path: "", value: "" },
                  UI: [
                    {
                      element: "input",
                      storeAs: "Path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "value",
                      name: "Value",
                    },
                    "-",
                    {
                      element: "store",
                      storeAs: "store",
                      name: "Store As",
                    },
                  ],
                },
                object: {
                  name: "Search through array Value in an object",
                  preview:
                    "`Query: ${option.data.Path} - ${option.data.name}(${option.data.value})`",
                  data: { Path: "", value: "", name: "" },
                  UI: [
                    {
                      element: "input",
                      storeAs: "Path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "name",
                      name: "Name",
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "value",
                      name: "Value",
                    },
                    "-",
                    {
                      element: "store",
                      storeAs: "store",
                      name: "Store As",
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

  subtitle: (values, constants, thisAction) => {
    const checkAndCount = (arr) => (Array.isArray(arr) ? arr.length : 0);
    let numData1 = checkAndCount(values.cases);
    let numData2 = checkAndCount(values.cases1);
    let numData3 = checkAndCount(values.cases2);

    let numData = numData1 + numData2 + numData3;

    return `Getting ${numData} Information(s)`;
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
    if (fs.existsSync(fullPath)) {
      const rawData = fs.readFileSync(fullPath, "utf8");
      data = JSON.parse(rawData);
    }

    if (Array.isArray(values.cases)) {
      for (const dataCase of values.cases) {
        if (dataCase.type !== "data") continue;
   
        const path = bridge.transf(dataCase.data.Path);
        const pathParts = path.split(".");
        let current = data;

        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          const arrayMatch = part.match(/^(.+)\[(R(?::(\d+))?|\d+|N|\^)\]$/);

          if (arrayMatch) {
            const key = arrayMatch[1];
            const indexOrSymbol = arrayMatch[2];
            const countMatch = arrayMatch[3];
            const count = countMatch ? parseInt(countMatch, 10) : 1;

            if (!current || !Array.isArray(current[key])) {
              current = undefined;
              break;
            }

            const array = current[key];

            if (indexOrSymbol === "N" || indexOrSymbol === "^") {
              current = array[array.length - 1];
            } else if (indexOrSymbol.startsWith("R")) {
              if (array.length === 0) {
                current = undefined;
                break;
              }

              const indexes = new Set();
              while (indexes.size < count && indexes.size < array.length) {
                const randomIndex = Math.floor(Math.random() * array.length);
                indexes.add(randomIndex);
              }

              const selectedItems = Array.from(indexes).map((idx) => array[idx]);
              current = selectedItems;

              if (i === pathParts.length - 1) break;

              const remainingParts = pathParts.slice(i + 1);
              current = current.map(item => {
                if (typeof item !== "object" || item === null) return undefined;

                let deepValue = item;
                for (const subPart of remainingParts) {
                  if (!deepValue || typeof deepValue !== "object") return undefined;
                  deepValue = deepValue[subPart];
                }
                return deepValue;
              }).filter(v => v !== undefined);

              break;
            } else {
              const index = parseInt(indexOrSymbol, 10);
              if (isNaN(index) || index < 0 || index >= array.length) {
                current = undefined;
                break;
              }
              current = array[index];
            }
          } else {
            if (!current || typeof current !== "object" || current === null) {
              current = undefined;
              break;
            }
            current = current[part];
          }

          if (current === undefined) break;
        }

        bridge.store(dataCase.data.store, current);
      }
    }

    if (Array.isArray(values.cases1)) {
      for (const dataCase of values.cases1) {
        if (dataCase.type !== "data") continue;
    
        let pathParts = [];
        if (dataCase.data.Path) {
          const path = bridge.transf(dataCase.data.Path);
          pathParts = path.split(".");
        }
    
        let current = data;
    
        for (const part of pathParts) {
          if (
            /\[\d+\]$/.test(part) ||
            part.endsWith("[N]") ||
            part.endsWith("[^]") ||
            part.endsWith("[R]")
          ) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^|R)\]$/);
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
            } else if (indexOrSymbol === "R") {
              if (array.length === 0) {
                current = undefined;
                break;
              }
              const randomIndex = Math.floor(Math.random() * array.length);
              current = array[randomIndex];
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
    
        let names = [];
    
        if (current && typeof current === "object") {
          if (dataCase.data.objects) {
            for (let key in current) {
              if (!(typeof current[key] === "object")) {
                names.push(key);
              }
            }
          } else if (dataCase.data.lines) {
            for (let key in current) {
              if (typeof current[key] !== "string") {
                names.push(key);
              }
            }
          } else {
            for (let key in current) {
              names.push(key);
            }
          }
        }
    
        bridge.store(dataCase.data.store, names);
      }
    }

    if (Array.isArray(values.cases2)) {
      for (const dataCase of values.cases2) {
        const path = bridge.transf(dataCase.data.Path);
        const name = bridge.transf(dataCase.data.name);
        let rawValue = bridge.transf(dataCase.data.value);
        
        let operator = '==';
        let compareValue = rawValue;
        let forceNumber = false;
        
        const operatorMatch = rawValue.match(/^\[(>|<|>=|<=|=)\](.*)$/);
        if (operatorMatch) {
          operator = operatorMatch[1] === '=' ? '==' : operatorMatch[1];
          compareValue = operatorMatch[2].trim();
          forceNumber = true;
        }
    
        if (forceNumber) {
          compareValue = Number(compareValue);
          if (isNaN(compareValue)) {
            bridge.store(dataCase.data.store, [-1]);
            continue;
          }
        } else {
          const numValue = Number(compareValue);
          if (!isNaN(numValue)) {
            compareValue = numValue;
          }
        }
    
        const pathParts = path.split(".");
        let current = data;
    
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (/\[\d+\]$/.test(part) || part.endsWith("[N]") || part.endsWith("[^]") || part.endsWith("[R]")) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^|R)\]$/);
            if (!arrayKeyMatch) break;
 
            const [arrayKey, indexOrSymbol] = [arrayKeyMatch[1], arrayKeyMatch[2]];
 
            if (!Array.isArray(current[arrayKey])) break;
            const array = current[arrayKey];
  
            if (indexOrSymbol === "N" || indexOrSymbol === "^") {
              current = array[array.length - 1];
            } else if (indexOrSymbol === "R") {
              if (array.length === 0) {
                current = undefined;
                break;
              }
              current = array[Math.floor(Math.random() * array.length)];
            } else {
              const index = parseInt(indexOrSymbol, 10);
              if (isNaN(index) || index < 0 || index >= array.length) {
                current = undefined;
                break;
              }
              current = array[index];
            }
          } else {
            if (typeof current !== "object") break;
            current = current[part];
          }
          if (!current) break;
        }
    
        let result = [];
        if (current && Array.isArray(current)) {
          switch (dataCase.type) {
            case "value":
              current.forEach((item, index) => {
                const numItem = forceNumber ? Number(item) : item;
                if (forceNumber && isNaN(numItem)) return;
                
                let match;
                switch(operator) {
                  case '>': match = numItem > compareValue; break;
                  case '<': match = numItem < compareValue; break;
                  case '>=': match = numItem >= compareValue; break;
                  case '<=': match = numItem <= compareValue; break;
                  case '==': 
                  default: 
                    match = forceNumber 
                      ? numItem === compareValue 
                      : item == compareValue;
                }
                if (match) result.push(index);
              });
              break;
    
            case "object":
              current.forEach((item, index) => {
                if (typeof item !== "object" || item[name] === undefined) return;
                
                const itemValue = item[name];
                const numValue = forceNumber ? Number(itemValue) : itemValue;
                if (forceNumber && isNaN(numValue)) return;
                
                let match;
                switch(operator) {
                  case '>': match = numValue > compareValue; break;
                  case '<': match = numValue < compareValue; break;
                  case '>=': match = numValue >= compareValue; break;
                  case '<=': match = numValue <= compareValue; break;
                  case '==': 
                  default: 
                    match = forceNumber 
                      ? numValue === compareValue 
                      : itemValue == compareValue;
                }
                if (match) result.push(index);
              });
              break;
          }
        }
    
        if (result.length === 0) result.push(-1);
        bridge.store(dataCase.data.store, result);
      }
    }
  },
};
