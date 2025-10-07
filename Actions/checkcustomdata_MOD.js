modVersion = "v2.3.0";

module.exports = {
  data: {
    name: "Check Custom Data",
  },
  aliases: [
    "Check Json Data",
    "Validate Custom Data",
    "Inspect Custom Data",
    "Verify Custom Data",
    "Test Custom Data",
    "Check Stored Data",
    "Examine Custom JSON",
    "Check JSON Data",
    "Validate JSON Payload",
    "Inspect Data Structure",
  ],
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
      let matchesCriteria = false;
      
      const isObjectLike = (v) => v !== null && typeof v === "object";
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
      
      const selectFromArrayByToken = (arr, token) => {
          if (!Array.isArray(arr)) return [];
          if (token === "N" || token === "^") {
              if (arr.length === 0) return [];
              return [arr.length - 1];
          }
          if (token.startsWith("R")) {
              if (arr.length === 0) return [];
              let n = 1;
              const m = token.match(/^R(?::(\d+))?$/);
              if (m && m[1]) n = Math.max(1, parseInt(m[1], 10));
              const need = Math.min(n, arr.length);
              const idxs = new Set();
              while (idxs.size < need) idxs.add(Math.floor(Math.random() * arr.length));
              return Array.from(idxs);
          }
          const idx = parseInt(token, 10);
          if (Number.isNaN(idx) || idx < 0 || idx >= arr.length) return [];
          return [idx];
      };
      
      const traverseForRead = (root, rawPath) => {
          const segments = parsePathNested(rawPath);
          let nodes = [root];
          
          for (const seg of segments) {
              if (seg.key) {
                  const next = [];
                  for (const n of nodes) {
                      if (isObjectLike(n) && seg.key in n) next.push(n[seg.key]);
                  }
                  nodes = next;
                  if (nodes.length === 0) return [];
              }
              
              for (const op of seg.ops) {
                  const next = [];
                  for (const n of nodes) {
                      if (!Array.isArray(n)) continue;
                      const idxs = selectFromArrayByToken(n, op);
                      for (const i of idxs) next.push(n[i]);
                  }
                  nodes = next;
                  if (nodes.length === 0) return [];
              }
          }
          
          return nodes;
      };
      
      if (fs.existsSync(fullPath)) {
          try {
              const rawData = fs.readFileSync(fullPath, "utf8");
              data = JSON.parse(rawData);
              
              const path = bridge.transf(values.Path);
              const endNodes = traverseForRead(data, path);
              
              let variable;
              if (endNodes.length === 0) variable = undefined;
              else if (endNodes.length === 1) variable = endNodes[0];
              else variable = endNodes;
              
              let secondValue = bridge.transf(values.compareValue);
              
              const asArray = (v) => (Array.isArray(v) ? v : v === undefined ? [] : [v]);
              
              const cmp = values.comparator;
              const vals = asArray(variable);
              
              const someStr = (pred) =>
                  vals.some((v) => pred(v, typeof v?.toString === "function" ? v.toString() : String(v)));
              const everyStr = (pred) =>
                  vals.length === 0 ?
                  pred(undefined, "undefined") :
                  vals.every((v) => pred(v, typeof v?.toString === "function" ? v.toString() : String(v)));
              
              switch (cmp) {
                  case "Equals":
                      matchesCriteria = someStr((v) => `${v}` == `${secondValue}`);
                      break;
                  case "Doesn't Equal":
                      matchesCriteria = everyStr((v) => v != secondValue);
                      break;
                  case "Exists":
                      matchesCriteria = vals.some((v) => v !== null && v !== undefined);
                      break;
                  case "Equals Exactly":
                      matchesCriteria = vals.some((v) => v === secondValue);
                      break;
                  case "Greater Than":
                      matchesCriteria = vals.some((v) => Number(v) > Number(secondValue));
                      break;
                  case "Less Than":
                      matchesCriteria = vals.some((v) => Number(v) < Number(secondValue));
                      break;
                  case "Equal Or Greater Than":
                      matchesCriteria = vals.some((v) => Number(v) >= Number(secondValue));
                      break;
                  case "Equal Or Less Than":
                      matchesCriteria = vals.some((v) => Number(v) <= Number(secondValue));
                      break;
                  case "Is Number":
                      matchesCriteria = vals.some((v) => {
                          const n = Number(v);
                          return typeof n === "number" && !Number.isNaN(n);
                      });
                      break;
                  case "Matches Regex":
                      try {
                          const re = new RegExp(`^${secondValue}$`, "i");
                          matchesCriteria = vals.some((v) => re.test(String(v)));
                      } catch {
                          matchesCriteria = false;
                      }
                      break;
                  case "Exactly includes":
                      matchesCriteria = vals.some((v) =>
                          String(v).includes(typeof secondValue === "string" ? secondValue : String(secondValue))
                      );
                      break;
                  default:
                      matchesCriteria = false;
              }
          } catch (error) {
            bridge.call(values.false, values.falseActions);
          }
      }
      
      if (matchesCriteria) {
          bridge.call(values.true, values.trueActions);
      } else {
          bridge.call(values.false, values.falseActions);
      }
  },
};
