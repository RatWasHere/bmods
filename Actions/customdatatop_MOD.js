modVersion = "v2.3.0";

module.exports = {
  data: {
    name: "Custom Data Top",
  },
  aliases: [
    "Fetch Custom Data",
    "Retrieve Top JSON Data",
    "Load Custom Data",
    "Get Top Custom JSON",
    "Access Custom Data",
    "Fetch Top JSON",
    "Retrieve Custom Data Top",
  ],
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
      
      let data = fs.readFileSync(fullPath, "utf8");
      let jsonObject = JSON.parse(data);
      
      const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
      
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
          if (!rawPath) return [root];
          const segments = parsePathNested(rawPath);
          let nodes = [root];
          
          for (const seg of segments) {
              if (seg.key) {
                  const next = [];
                  for (const n of nodes) {
                      if (isObj(n) && seg.key in n) next.push(n[seg.key]);
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
      
      const getDeepValue = (obj, path) => {
          if (!path) return undefined;
          return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
      };
      
      const computeSortValue = (item, compile, fallback) => {
          if (compile === true) return fallback;
          
          if (typeof compile === "string" && compile.trim()) {
              const expr = compile.replace(
                  /([A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё_.]*)/g,
                  (m) => {
                      const val = getDeepValue(item, m);
                      const num = Number(val);
                      return Number.isFinite(num) ? String(num) : "0";
                  }
              );
              try {
                  return new Function(`return (${expr})`)();
              } catch {
                  return fallback;
              }
          }
          
          return fallback;
      };
      
      const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base"
      });
      const toSortKey = (v) => {
          const n = Number(v);
          if (Number.isFinite(n)) return n;
          return v == null ? "" : String(v);
      };
      const compareKeys = (aKey, bKey, order) => {
          const aNum = typeof aKey === "number" ? aKey : Number(aKey);
          const bNum = typeof bKey === "number" ? bKey : Number(bKey);
          const aIsNum = Number.isFinite(aNum);
          const bIsNum = Number.isFinite(bNum);
          
          let cmp;
          if (aIsNum && bIsNum) {
              cmp = aNum - bNum;
          } else {
              cmp = collator.compare(String(aKey), String(bKey));
          }
          return order === "Ascending" ? cmp : -cmp;
      };
      
      const nameidobject = bridge.transf(values.id);
      
      const additionalFields = [];
      if (Array.isArray(values.cases1)) {
          for (const dataCase of values.cases1) {
              const name = bridge.transf(dataCase.data.name);
              const compile = dataCase.data.compile;
              additionalFields.push({
                  name,
                  compile
              });
          }
      }
      
      const path = values.path ? bridge.transf(values.path) : null;
      
      let current;
      if (path) {
          const nodes = traverseForRead(jsonObject, path);
          if (nodes.length <= 1) {
              current = nodes[0];
          } else {
              const flat = [];
              for (const n of nodes) {
                  if (Array.isArray(n)) flat.push(...n);
                  else if (isObj(n)) flat.push(...Object.values(n));
                  else flat.push(n);
              }
              current = flat;
          }
      } else {
          current = jsonObject;
      }
      
      const dataList = [];
      const mainKey = bridge.transf(values.dataName);
      
      const pushEntryFromItem = (item, fallbackId) => {
          if (!isObj(item)) return;
          const entry = {
              [nameidobject]: item[nameidobject] ?? fallbackId
          };
          
          const mainValue = item[mainKey];
          if (mainValue !== undefined) entry[mainKey] = mainValue;
          
          let sortSet = false;
          
          for (const {
                  name,
                  compile
              }
              of additionalFields) {
              const fieldValue = item[name];
              if (fieldValue !== undefined) {
                  entry[name] = fieldValue;
                  
                  if (!sortSet && (compile === true || (typeof compile === "string" && compile.trim()))) {
                      const sv = computeSortValue(item, compile, fieldValue);
                      entry.SortValue = sv;
                      sortSet = true;
                  }
              }
          }
          
          dataList.push(entry);
      };
      
      if (Array.isArray(current)) {
          current.forEach((item, index) => pushEntryFromItem(item, index));
      } else if (isObj(current)) {
          for (const key in current) {
              pushEntryFromItem(current[key], key);
          }
      }
      
      if (dataList.length === 0) return;
      
      const sortOrder = values.sortOrder === "Ascending" ? "Ascending" : "Descending";
      const decorated = dataList.map((e, i) => {
          const base = e.SortValue !== undefined ? e.SortValue : e[mainKey];
          const key = toSortKey(base);
          return {
              e,
              i,
              key
          };
      });
      decorated.sort((A, B) => {
          const r = compareKeys(A.key, B.key, sortOrder);
          if (r !== 0) return r;
          const idA = String(A.e[nameidobject] ?? "");
          const idB = String(B.e[nameidobject] ?? "");
          const r2 = collator.compare(idA, idB);
          if (r2 !== 0) return r2;
          return A.i - B.i;
      });
      const sorted = decorated.map(d => d.e);
      
      let filteredDataList;
      const resultType = String(values.resultType || "").toLowerCase();
      switch (resultType) {
          case "top n results": {
              const topN = Number(bridge.transf(values.rangeStart));
              if (topN > 0) filteredDataList = sorted.slice(0, topN);
              break;
          }
          case "bottom n results": {
              const bottomN = Number(bridge.transf(values.rangeEnd));
              if (bottomN > 0) filteredDataList = sorted.slice(-bottomN);
              break;
          }
          case "range": {
              const rangeStart = Number(bridge.transf(values.rangeStart));
              const rangeEnd = Number(bridge.transf(values.rangeEnd));
              filteredDataList = sorted.slice(
                  Number.isFinite(rangeStart) ? rangeStart : 0,
                  Number.isFinite(rangeEnd) ? rangeEnd : undefined
              );
              break;
          }
          case "all results":
          default:
              filteredDataList = sorted;
              break;
      }
      
      if (filteredDataList) {
          const formatType = String(values.formatType || "").toLowerCase();
          switch (formatType) {
              case "the created array is top":
                  bridge.store(values.store, filteredDataList);
                  break;
                  
              case "custom text as a list": {
                  const formattedResult = filteredDataList
                      .map((item) => {
                          let resultString = values.resultFormat;
                          
                          resultString = resultString.replace(/\$\{([^}]+)\}/g, (_, content) => {
                              const expr = content.trim();
                              if (/[+\-*/()%]/.test(expr)) {
                                  const replaced = expr.replace(
                                      /([A-Za-zА-Яа-яЁё_][\wА-Яа-яЁё_.]*)/g,
                                      (m) => {
                                          const v = getDeepValue(item, m);
                                          const n = Number(v);
                                          return Number.isFinite(n) ? String(n) : "0";
                                      }
                                  );
                                  try {
                                      return new Function(`return (${replaced})`)();
                                  } catch {
                                      return "";
                                  }
                              } else {
                                  const v = getDeepValue(item, expr);
                                  return v != null ? String(v) : "";
                              }
                          });
                          
                          return resultString;
                      })
                      .join(",");
                  
                  bridge.store(values.store, bridge.transf(formattedResult).split(","));
                  break;
              }
          }
      } 
  },
};
