modVersion = "v2.5.0";

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
          const {
              clipboard,
              shell
          } = require('electron');
          const {
              exec
          } = require('child_process');
          
          let directoryHistory = [];
          let initialInterfaceElements = [];
          
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
              
              Object.defineProperty(btn, 'disabled', {
                  set(value) {
                      if (value) {
                          btn.style.opacity = "0.5";
                          btn.style.cursor = "not-allowed";
                          btn.onclick = null;
                      } else {
                          btn.style.opacity = "1";
                          btn.style.cursor = "pointer";
                          btn.onclick = handler;
                      }
                  }
              });
              
              return btn;
          }
          
          function getProjectDirectory() {
              const botData = require("../data.json");
              const currentDir = process.cwd().replace(/\\/g, "/");
              return currentDir.includes("common/Bot Maker For Discord") ?
                  botData.prjSrc.replace(/\\/g, "/") :
                  currentDir;
          }
          
          function readDirectory(directoryPath) {
              try {
                  const items = fs.readdirSync(directoryPath, {
                      withFileTypes: true
                  });
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
              
              const backButton = createStyledButton("Back", () => {
                  if (directoryHistory.length > 1) {
                      directoryHistory.pop();
                      displayDirectoryContents(directoryHistory[directoryHistory.length - 1]);
                  } else {
                      directoryHistory = [];
                      displayInitialMenu();
                      if (copyPathButton) copyPathButton.disabled = true;
                      if (selectionMessage) selectionMessage.style.display = "none";
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
                          relativePath
                      };
                  }
              }
              
              const copyPathButton = createStyledButton("Copy Path", () => {
                  if (selectedItem && !selectedItem.isDirectory && selectedItem.relativePath) {
                      clipboard.writeText(selectedItem.relativePath);
                      alert(`Copied path: ${selectedItem.relativePath}`);
                  } else {
                      alert("Please select a .json file to copy its path.");
                  }
              });
              copyPathButton.disabled = true;
              
              const openFolderButton = createStyledButton("Open Folder", () => {
                  let folderPath;
                  
                  if (selectedItem && selectedItem.fullPath) {
                      folderPath = selectedItem.isDirectory ?
                          selectedItem.fullPath :
                          path.dirname(selectedItem.fullPath);
                  } else {
                      folderPath = getProjectDirectory();
                  }
                  
                  if (process.platform === 'win32') {
                      const cmd = selectedItem && !selectedItem.isDirectory ?
                          `explorer /select,"${selectedItem.fullPath.replace(/\//g, '\\')}"` :
                          `explorer "${folderPath.replace(/\//g, '\\')}"`;
                      exec(cmd);
                  } else {
                      shell.openPath(folderPath).then((error) => {
                          if (error) alert(`Could not open folder: ${error}`);
                      });
                  }
              });
              
              buttonContainer.appendChild(backButton);
              buttonContainer.appendChild(copyPathButton);
              buttonContainer.appendChild(openFolderButton);
              
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
                  listItem.textContent = item.isDirectory ?
                      `[Folder] ${item.name}` :
                      `[File] ${item.name}`;
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
                              selectionMessage.textContent = `File selected: ${item.name}`;
                              selectionMessage.style.display = "block";
                              copyPathButton.disabled = false;
                          }
                      } else {
                          selectedItem = null;
                          selectionMessage.style.display = "none";
                          copyPathButton.disabled = true;
                          
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
              
              if (typeof copyPathButton !== 'undefined' && copyPathButton) {
                  copyPathButton.disabled = true;
              }
              if (selectionMessage) {
                  selectionMessage.style.display = "none";
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
        background-color: #333;
        color: #fff;
      ">
        Show Project Files
      </div>
    `;
              button.onclick = () => {
                  const projectDir = getProjectDirectory();
                  directoryHistory = [projectDir];
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
          fs.mkdirSync(dirPath, {
              recursive: true
          });
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
      
      const parsePathNested = (path) =>
          path.split(".").map((seg) => {
              const key = seg.match(/^[^\[]+/)?.[0] ?? "";
              const ops = [];
              const re = /\[([^\]]+)\]/g;
              let m;
              while ((m = re.exec(seg))) ops.push(m[1]);
              return {
                  key,
                  ops
              };
          });
      
      const selectFromArrayByToken = (arr, token, mode) => {
          if (!Array.isArray(arr)) return [];
          
          if (token === "N" || token === "^") {
              if (arr.length === 0) return [];
              return [arr[arr.length - 1]];
          }
          
          if (token.startsWith("R")) {
              let count = 1;
              const m = token.match(/^R(?::(\d+))?$/);
              if (m && m[1]) count = parseInt(m[1], 10);
              if (mode !== "cases") count = 1;
              
              if (arr.length === 0) return [];
              const need = Math.min(count, arr.length);
              const idxs = new Set();
              while (idxs.size < need) idxs.add(Math.floor(Math.random() * arr.length));
              return Array.from(idxs).map((i) => arr[i]);
          }
          
          const idx = parseInt(token, 10);
          if (isNaN(idx) || idx < 0 || idx >= arr.length) return [];
          return [arr[idx]];
      };
      
      const traverseNested = (root, pathStr, mode) => {
          const segments = parsePathNested(pathStr);
          let nodes = [root];
          
          for (const seg of segments) {
              if (seg.key) {
                  const next = [];
                  for (const n of nodes) {
                      if (n && typeof n === "object" && seg.key in n) next.push(n[seg.key]);
                  }
                  nodes = next;
                  if (nodes.length === 0) return [];
              }
              
              for (const op of seg.ops) {
                  const next = [];
                  for (const n of nodes) {
                      if (Array.isArray(n)) {
                          const picked = selectFromArrayByToken(n, op, mode);
                          for (const p of picked) next.push(p);
                      }
                  }
                  nodes = next;
                  if (nodes.length === 0) return [];
              }
          }
          
          return nodes;
      };
      
      if (Array.isArray(values.cases)) {
          for (const dataCase of values.cases) {
              if (dataCase.type !== "data") continue;
              
              const path = bridge.transf(dataCase.data.Path);
              const endNodes = traverseNested(data, path, "cases");
              
              let current;
              if (endNodes.length === 0) current = undefined;
              else if (endNodes.length === 1) current = endNodes[0];
              else current = endNodes;
              
              bridge.store(dataCase.data.store, current);
          }
      }
      
      if (Array.isArray(values.cases1)) {
          for (const dataCase of values.cases1) {
              if (dataCase.type !== "data") continue;
              
              let endNodes;
              if (dataCase.data.Path) {
                  const path = bridge.transf(dataCase.data.Path);
                  endNodes = traverseNested(data, path, "cases1");
              } else {
                  endNodes = [data];
              }
              
              const namesSet = new Set();
              
              for (const current of endNodes) {
                  if (current && typeof current === "object" && !Array.isArray(current)) {
                      if (dataCase.data.objects) {
                          for (let key in current) {
                              if (!(typeof current[key] === "object")) namesSet.add(key);
                          }
                      } else if (dataCase.data.lines) {
                          for (let key in current) {
                              if (typeof current[key] !== "string") namesSet.add(key);
                          }
                      } else {
                          for (let key in current) namesSet.add(key);
                      }
                  }
              }
              
              const names = Array.from(namesSet);
              bridge.store(dataCase.data.store, names);
          }
      }
      
      if (Array.isArray(values.cases2)) {
          for (const dataCase of values.cases2) {
              const path = bridge.transf(dataCase.data.Path);
              const name = bridge.transf(dataCase.data.name);
              let rawValue = bridge.transf(dataCase.data.value);
              
              let operator = "==";
              let compareValue = rawValue;
              let forceNumber = false;
              
              const operatorMatch = rawValue.match(/^\[(>|<|>=|<=|=)\](.*)$/);
              if (operatorMatch) {
                  operator = operatorMatch[1] === "=" ? "==" : operatorMatch[1];
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
                  if (!isNaN(numValue)) compareValue = numValue;
              }
              
              const endNodes = traverseNested(data, path, "cases2");
              
              let current = [];
              if (endNodes.length === 1 && Array.isArray(endNodes[0])) {
                  current = endNodes[0];
              } else if (endNodes.length >= 1) {
                  for (const n of endNodes)
                      if (Array.isArray(n)) current.push(...n);
              }
              
              let result = [];
              if (Array.isArray(current)) {
                  switch (dataCase.type) {
                      case "value":
                          current.forEach((item, index) => {
                              const numItem = forceNumber ? Number(item) : item;
                              if (forceNumber && isNaN(numItem)) return;
                              
                              let match;
                              switch (operator) {
                                  case ">":
                                      match = numItem > compareValue;
                                      break;
                                  case "<":
                                      match = numItem < compareValue;
                                      break;
                                  case ">=":
                                      match = numItem >= compareValue;
                                      break;
                                  case "<=":
                                      match = numItem <= compareValue;
                                      break;
                                  case "==":
                                  default:
                                      match = forceNumber ? numItem === compareValue : item == compareValue;
                              }
                              if (match) result.push(index);
                          });
                          break;
                          
                      case "object":
                          current.forEach((item, index) => {
                              if (typeof item !== "object" || item === null || item[name] === undefined) return;
                              
                              const itemValue = item[name];
                              const numValue = forceNumber ? Number(itemValue) : itemValue;
                              if (forceNumber && isNaN(numValue)) return;
                              
                              let match;
                              switch (operator) {
                                  case ">":
                                      match = numValue > compareValue;
                                      break;
                                  case "<":
                                      match = numValue < compareValue;
                                      break;
                                  case ">=":
                                      match = numValue >= compareValue;
                                      break;
                                  case "<=":
                                      match = numValue <= compareValue;
                                      break;
                                  case "==":
                                  default:
                                      match = forceNumber ? numValue === compareValue : itemValue == compareValue;
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
