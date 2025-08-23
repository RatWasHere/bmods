modVersion = "v2.3.1";

module.exports = {
  data: {
    name: "Control Custom Data",
  },
  aliases: [
    "Control Json Data",
  ],
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Allows you to create custom json files!",
  },
  UI: [
    {
      element: "input",
      name: "Database",
      storeAs: "database",
    },
    "-",
    {
      element: "toggleGroup",
      storeAs: ["logToConsole", "deleteJson"],
      nameSchemes: ["Log Result to Console", "Clear contents JSON file"],
      help: {
        title: "Log Result to Console and Clear contents JSON file?",
        UI: [
          {
            element: "text",
            text: "Log Result to Console?",
            header: true,
          },
          {
            element: "text",
            text: `Send the final file to the console.`,
          },
          "-",
          {
            element: "text",
            text: "Clear contents JSON file?",
            header: true,
          },
          {
            element: "text",
            text: `Clear the file at the beginning. before further editing.`,
          },
        ],
      },
    },
    "-",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Create Data Value",
      types: {
        options: "Create Data Value",
      },
      UItypes: {
        options: {
          name: "Create Data Value",
          inheritData: true,
          UI: [
            {
              element: "menu",
              help: {
                title: "Create Data Value?",
                UI: [
                  {
                    element: "text",
                    text: "Create Data Value?",
                    header: true,
                  },
                  {
                    element: "text",
                    text: `You can create both values and values in objects.`,
                  },
                ],
              },
              storeAs: "cases",
              name: "Create Data Value",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Create Data",
                  preview:
                    "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.path} - ${option.data.value}`",
                  data: { path: "", value: "" },
                  UI: [
                    {
                      element: "menu",
                      max: 1,
                      storeAs: "comparisonlist",
                      name: "Comparison",
                      types: {
                        Comparison: "Comparison",
                      },
                      UItypes: {
                        Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [
                            {
                              element: "var",
                              storeAs: "variable",
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
                          ],
                        },
                      },
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "value",
                      name: "Value",
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
      storeAs: "Data transfer",
      types: {
        options: "Data transfer",
      },
      UItypes: {
        options: {
          name: "Data transfer",
          inheritData: true,
          UI: [
            {
              element: "menu",
              help: {
                title: "Data transfer?",
                UI: [
                  {
                    element: "text",
                    text: "Data transfer?",
                    header: true,
                  },
                  {
                    element: "text",
                    text: `With this, you can transfer data from one place to another.`,
                  },
                ],
              },
              storeAs: "cases3",
              name: "Data transfer",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Data transfer",
                  preview:
                    "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.path} - ${option.data.value}`",
                  data: { path: "", pathtransfer: "" },
                  UI: [
                    {
                      element: "menu",
                      max: 1,
                      storeAs: "comparisonlist",
                      name: "Comparison",
                      types: {
                        Comparison: "Comparison",
                      },
                      UItypes: {
                        Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [
                            {
                              element: "var",
                              storeAs: "variable",
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
                          ],
                        },
                      },
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "toggle",
                      storeAs: "deletedata",       
                      name: "Deleting the transfer date.",
                      true: "Yes!",
                      false: "Nono!"
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "pathtransfer",
                      name: "Path transfer",
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
      storeAs: "Create Data Object",
      types: {
        options: "Create Data Object",
      },
      UItypes: {
        options: {
          name: "Create Data Object",
          inheritData: true,
          UI: [
            {
              element: "menu",
              help: {
                title: "Create Data Object?",
                UI: [
                  {
                    element: "text",
                    text: "Create Data Object?",
                    header: true,
                  },
                  {
                    element: "text",
                    text: `You can use this feature to create an object from scratch. And if it exists, it will be completely overwritten with a new one.`,
                  },
                ],
              },
              storeAs: "cases4",
              name: "Create Data Object",
              types: {
                value: "Create Data Object Value",
                array: "Create Data Object Array",
              },
              max: 200,
              UItypes: {
                value: {
                  name: "Create Data Object Value",
                  preview:
                    "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.path} - ${option.data.name} (${option.data.cases5?.length ?? 0} items)`",
                  data: { path: "", name: "" },
                  UI: [
                    {
                      element: "menu",
                      max: 1,
                      storeAs: "comparisonlist",
                      name: "Comparison",
                      types: {
                        Comparison: "Comparison",
                      },
                      UItypes: {
                        Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [
                            {
                              element: "var",
                              storeAs: "variable",
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
                          ],
                        },
                      },
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "name",
                      name: "Name Object",
                    },
                    "-",
                    {
                      element: "menu",
                      storeAs: "cases5",
                      name: "Object Value",
                      types: {
                        data: "Data",
                      },
                      max: 200,
                      UItypes: {
                        data: {
                          name: "Add Object Value",
                          preview:
                            "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.name} - ${option.data.value}`",
                          data: { name: "", value: "" },
                          UI: [
                            {
                              element: "menu",
                              max: 1,
                              storeAs: "comparisonlist",
                              name: "Comparison",
                              types: {
                                Comparison: "Comparison",
                              },
                              UItypes: {
                                Comparison: {
                                  name: "Comparison",
                                  data: {},
                                  UI: [
                                    {
                                      element: "var",
                                      storeAs: "variable",
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
                                  ],
                                },
                              },
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
                          ],
                        },
                      },
                    },
                  ],
                },
                array: {
                  name: "Create Data Object Array",
                  preview:
                    "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.path} (${option.data.cases6?.length ?? 0} items)`",
                  data: {},
                  UI: [
                    {
                      element: "menu",
                      max: 1,
                      storeAs: "comparisonlist",
                      name: "Comparison",
                      types: {
                        Comparison: "Comparison",
                      },
                      UItypes: {
                        Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [
                            {
                              element: "var",
                              storeAs: "variable",
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
                          ],
                        },
                      },
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "path",
                      name: "Path",
                    },
                    "-",
                    {
                      element: "menu",
                      storeAs: "cases6",
                      name: "Object Array Value",
                      types: {
                        data: "Data",
                      },
                      max: 200,
                      UItypes: {
                        data: {
                          name: "Add Object Array Value",
                          preview:
                            "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Query: ${option.data.name} - ${option.data.value}`",
                          data: { name: "", value: "" },
                          UI: [
                            {
                              element: "menu",
                              max: 1,
                              storeAs: "comparisonlist",
                              name: "Comparison",
                              types: {
                                Comparison: "Comparison",
                              },
                              UItypes: {
                                Comparison: {
                                  name: "Comparison",
                                  data: {},
                                  UI: [
                                    {
                                      element: "var",
                                      storeAs: "variable",
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
                                  ],
                                },
                              },
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
                          ],
                        },
                      },
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
      storeAs: "Delete Data",
      types: {
        options: "Delete Data",
      },
      UItypes: {
        options: {
          name: "Delete Data",
          inheritData: true,
          UI: [
            {
              element: "menu",
              help: {
                title: "Delete Data?",
                UI: [
                  {
                    element: "text",
                    text: "Delete Data?",
                    header: true,
                  },
                  {
                    element: "text",
                    text: `You can delete the data in json.`,
                  },
                ],
              },
              storeAs: "cases1",
              name: "Delete Data",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Delete Data",
                  preview:
                    "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Path: ${option.data.path}`",
                  data: { patch: "" },
                  UI: [
                    {
                      element: "menu",
                      max: 1,
                      storeAs: "comparisonlist",
                      name: "Comparison",
                      types: {
                        Comparison: "Comparison",
                      },
                      UItypes: {
                        Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [
                            {
                              element: "var",
                              storeAs: "variable",
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
                          ],
                        },
                      },
                    },
                    "-",
                    {
                      element: "input",
                      storeAs: "path",
                      name: "Path",
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
    let numData4 = checkAndCount(values.cases3);
    let numData5 = checkAndCount(values.cases4);

    let numData = numData1 + numData2 + numData3 + numData4 + numData5;

    return `Controlling ${numData} Data(s)`;
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
      
      function matchesComparator(variable, comparator, secondValue) {
          switch (comparator) {
              case "Equals":
                  return `${variable}` == `${secondValue}`;
              case "Doesn't Equal":
                  return variable != secondValue;
              case "Exists":
                  return variable !== null && variable !== undefined;
              case "Equals Exactly":
                  return variable === secondValue;
              case "Greater Than":
                  return Number(variable) > Number(secondValue);
              case "Less Than":
                  return Number(variable) < Number(secondValue);
              case "Equal Or Greater Than":
                  return Number(variable) >= Number(secondValue);
              case "Equal Or Less Than":
                  return Number(variable) <= Number(secondValue);
              case "Is Number":
                  return !isNaN(parseInt(variable));
              case "Matches Regex":
                  try {
                      return new RegExp(`^${secondValue}$`, "i").test(variable);
                  } catch (e) {
                      return false;
                  }
              case "Exactly includes":
                  return typeof variable?.toString().includes === "function" ?
                      variable.toString().includes(secondValue) :
                      false;
              default:
                  return false;
          }
      }
      
      if (Array.isArray(values.cases)) {
          for (const dataCase of values.cases) {
              if (dataCase.type !== "data") continue;
              
              const comparison = dataCase.data.comparisonlist?.[0];
              let matchesCriteria = true;
              
              if (comparison) {
                  const variable = bridge.get(comparison.data.variable);
                  const secondValue = bridge.transf(comparison.data.compareValue);
                  matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
              }
              
              if (matchesCriteria) {
                  const rawPath = bridge.transf(dataCase.data.path);
                  const value = bridge.transf(dataCase.data.value);
                  
                  let oldValue = undefined;
                  
                  const pathParts = rawPath.split(".");
                  let current = data;
                  
                  for (let i = 0; i < pathParts.length - 1; i++) {
                      let part = pathParts[i];
                      const arrayMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
                      
                      if (arrayMatch) {
                          const [_, arrayKey, indexOrSymbol] = arrayMatch;
                          if (!Array.isArray(current[arrayKey])) {
                              current[arrayKey] = [];
                          }
                          let array = current[arrayKey];
                          
                          if (indexOrSymbol === "N") {
                              const nextPart = pathParts[i + 1];
                              if (nextPart) {
                                  array.push({});
                                  current = array[array.length - 1];
                              } else {
                                  array.push(value);
                              }
                              continue;
                          } else if (indexOrSymbol === "^") {
                              if (array.length === 0) {
                                  array.push({});
                              }
                              current = array[array.length - 1];
                              continue;
                          } else {
                              const index = parseInt(indexOrSymbol, 10);
                              if (isNaN(index)) continue;
                              while (array.length <= index) {
                                  array.push(null);
                              }
                              if (typeof array[index] !== "object" || array[index] === null) {
                                  array[index] = {};
                              }
                              current = array[index];
                          }
                      } else {
                          if (typeof current[part] !== "object" || current[part] === null) {
                              current[part] = {};
                          }
                          current = current[part];
                      }
                  }
                  
                  const lastPart = pathParts[pathParts.length - 1];
                  const lastPartMatch = lastPart.match(/^(.+)\[(\d+|N|\^)\]$/);
                  
                  if (lastPartMatch) {
                      const [_, arrayKey, indexOrSymbol] = lastPartMatch;
                      if (!Array.isArray(current[arrayKey])) {
                          current[arrayKey] = [];
                      }
                      const array = current[arrayKey];
                      
                      if (indexOrSymbol === "N") {
                          oldValue = undefined;
                          array.push(value);
                      } else if (indexOrSymbol === "^") {
                          oldValue = array.length > 0 ? array[array.length - 1] : undefined;
                          if (array.length === 0) {
                              array.push(typeof value === "object" ? {
                                  ...value
                              } : value);
                          } else {
                              if (typeof array[array.length - 1] !== "object") {
                                  array[array.length - 1] = {};
                              }
                              array[array.length - 1] = {
                                  ...array[array.length - 1],
                                  ...(typeof value === "object" ? value : {}),
                              };
                          }
                      } else {
                          const index = parseInt(indexOrSymbol, 10);
                          if (isNaN(index)) continue;
                          while (array.length <= index) {
                              array.push(null);
                          }
                          oldValue = array[index];
                          if (typeof value === "object" && value !== null) {
                              if (typeof array[index] !== "object" || array[index] === null) {
                                  array[index] = {};
                              }
                              array[index] = {
                                  ...array[index],
                                  ...value
                              };
                          } else {
                              array[index] = value;
                          }
                      }
                  } else {
                      oldValue = current[lastPart];
                      if (typeof value === "object" && value !== null) {
                          current[lastPart] = {
                              ...(current[lastPart] || {}),
                              ...value
                          };
                      } else {
                          current[lastPart] = value;
                      }
                  }
                  
                  
                  let changeType;
                  if (oldValue === undefined || oldValue === null) {
                      changeType = "set";
                  } else {
                      changeType = "update";
                  }
                  
                  if (typeof client?.emitDataChange === "function") {
                      client.emitDataChange(rawPath, value, oldValue, changeType);
                  }
              }
          }
      }
      
      if (Array.isArray(values.cases4)) {
          for (const dataCase of values.cases4) {
              switch (dataCase.type) {
                  case "value":
                      if (Array.isArray(dataCase.data?.cases5)) {
                          const comparison = dataCase.data.comparisonlist?.[0];
                          let matchesCriteria = true;
                          if (comparison) {
                              const variable = bridge.get(comparison.data.variable);
                              const secondValue = bridge.transf(comparison.data.compareValue);
                              matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
                          }
                          if (matchesCriteria == true) {
                              const res = dataCase.data.cases5.reduce((acc, item) => {
                                  if (
                                      item.type === "data" &&
                                      item.data &&
                                      typeof item.data.name === "string" &&
                                      typeof item.data.value !== "undefined"
                                  ) {
                                      const comparison = item.data.comparisonlist?.[0];
                                      let itemMatches = true;
                                      if (comparison) {
                                          const variable = bridge.get(comparison.data.variable);
                                          const secondValue = bridge.transf(comparison.data.compareValue);
                                          itemMatches = matchesComparator(variable, comparison.data.comparator, secondValue);
                                      }
                                      if (itemMatches) {
                                          acc[bridge.transf(item.data.name)] = bridge.transf(
                                              item.data.value
                                          );
                                      }
                                  }
                                  return acc;
                              }, {});
                              
                              const resu = dataCase.data.name ? {
                                      [bridge.transf(dataCase.data.name)]: res
                                  } :
                                  res;
                              
                              const rawPath = bridge.transf(dataCase.data.path);
                              const pathParts = rawPath.split(".");
                              let current = data;
                              
                              let oldValue = undefined;
                              
                              for (let i = 0; i < pathParts.length - 1; i++) {
                                  const part = pathParts[i];
                                  if (!current[part]) current[part] = {};
                                  current = current[part];
                              }
                              
                              const lastPart = pathParts[pathParts.length - 1];
                              current[lastPart] = resu;
                              
                              const changeType = oldValue === undefined ? "set" : "update";
                              
                              if (typeof client?.emitDataChange === "function") {
                                  client.emitDataChange(rawPath, resu, oldValue, changeType);
                              }
                          }
                      }
                      break;
                      
                  case "array":
                      if (Array.isArray(dataCase.data?.cases6)) {
                          const comparison = dataCase.data.comparisonlist?.[0];
                          let matchesCriteria = true;
                          if (comparison) {
                              const variable = bridge.get(comparison.data.variable);
                              const secondValue = bridge.transf(comparison.data.compareValue);
                              matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
                          }
                          if (matchesCriteria) {
                              const result = dataCase.data.cases6.reduce((acc, item) => {
                                  if (
                                      item.type === "data" &&
                                      item.data &&
                                      typeof item.data.name === "string" &&
                                      typeof item.data.value !== "undefined"
                                  ) {
                                      const comparison = item.data.comparisonlist?.[0];
                                      let itemMatches = true;
                                      if (comparison) {
                                          const variable = bridge.get(comparison.data.variable);
                                          const secondValue = bridge.transf(comparison.data.compareValue);
                                          itemMatches = matchesComparator(variable, comparison.data.comparator, secondValue);
                                      }
                                      if (itemMatches) {
                                          acc[bridge.transf(item.data.name)] = bridge.transf(
                                              item.data.value
                                          );
                                      }
                                  }
                                  return acc;
                              }, {});
                              
                              const rawPath = bridge.transf(dataCase.data.path);
                              const pathParts = rawPath.split(".");
                              let current = data;
                              
                              let oldValue = undefined;
                              
                              for (let i = 0; i < pathParts.length - 1; i++) {
                                  const part = pathParts[i];
                                  if (!current[part]) current[part] = {};
                                  current = current[part];
                              }
                              
                              const lastPart = pathParts[pathParts.length - 1];
                              if (!Array.isArray(current[lastPart])) {
                                  current[lastPart] = [];
                              }
                              current[lastPart].push(result);
                              
                              const changeType = oldValue === undefined ? "set" : "update";
                              
                              if (typeof client?.emitDataChange === "function") {
                                  client.emitDataChange(rawPath, result, oldValue, changeType);
                              }
                          }
                      }
                      break;
              }
          }
      }
      
      if (Array.isArray(values.cases3)) {
          for (const dataCase of values.cases3) {
              if (dataCase.type !== "data") continue;
              
              const comparison = dataCase.data.comparisonlist?.[0];
              let matchesCriteria = true;
              
              if (comparison) {
                  const variable = bridge.get(comparison.data.variable);
                  const secondValue = bridge.transf(comparison.data.compareValue);
                  matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
              }
              
              if (!matchesCriteria) continue;
              
              const path = bridge.transf(dataCase.data.path);
              const pathtransfer = bridge.transf(dataCase.data.pathtransfer);
              const shouldDelete = Boolean(dataCase.data.deletedata);
              
              const getValueFromPath = (obj, pathStr) => {
                  const parts = pathStr.split(".");
                  let current = obj;
                  
                  for (let i = 0; i < parts.length; i++) {
                      const part = parts[i];
                      const arrayMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
                      
                      if (arrayMatch) {
                          const key = arrayMatch[1];
                          const indexStr = arrayMatch[2];
                          
                          if (!current[key] || !Array.isArray(current[key])) {
                              return {
                                  found: false
                              };
                          }
                          
                          const arr = current[key];
                          let index;
                          
                          if (indexStr === "N") index = arr.length - 1;
                          else if (indexStr === "^") index = 0;
                          else {
                              index = parseInt(indexStr, 10);
                              if (isNaN(index) || index < 0 || index >= arr.length) {
                                  return {
                                      found: false
                                  };
                              }
                          }
                          
                          if (i === parts.length - 1) {
                              return {
                                  found: true,
                                  value: arr[index],
                                  parent: arr,
                                  key: index
                              };
                          } else {
                              if (index >= 0 && index < arr.length) {
                                  current = arr[index];
                              } else {
                                  return {
                                      found: false
                                  };
                              }
                          }
                      } else {
                          if (!current.hasOwnProperty(part)) {
                              return {
                                  found: false
                              };
                          }
                          if (i === parts.length - 1) {
                              return {
                                  found: true,
                                  value: current[part],
                                  parent: current,
                                  key: part
                              };
                          }
                          current = current[part];
                      }
                  }
                  return {
                      found: false
                  };
              };
              
              const sourceResult = getValueFromPath(data, path);
              if (!sourceResult.found) continue;
              
              const {
                  value: transferredValue,
                  parent: srcParent,
                  key: srcKey
              } = sourceResult;
              
              const transferParts = pathtransfer.split(".");
              let transferParent = data;
              
              for (let i = 0; i < transferParts.length - 1; i++) {
                  const part = transferParts[i];
                  const arrayMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
                  
                  if (arrayMatch) {
                      const arrayKey = arrayMatch[1];
                      const indexStr = arrayMatch[2];
                      
                      if (!Array.isArray(transferParent[arrayKey])) {
                          transferParent[arrayKey] = [];
                      }
                      const arr = transferParent[arrayKey];
                      
                      let index;
                      if (indexStr === "N") {
                          if (arr.length === 0) {
                              arr[0] = {};
                          }
                          index = arr.length - 1;
                      } else if (indexStr === "^") {
                          if (arr.length === 0) {
                              arr[0] = {};
                          }
                          index = 0;
                      } else {
                          index = parseInt(indexStr, 10);
                          if (isNaN(index)) continue;
                          
                          while (arr.length <= index) {
                              arr.push(undefined);
                          }
                          
                          if (arr[index] === undefined || arr[index] === null || typeof arr[index] !== "object") {
                              arr[index] = {};
                          }
                      }
                      
                      transferParent = arr[index];
                  } else {
                      if (!transferParent[part] || typeof transferParent[part] !== "object" || transferParent[part] === null) {
                          transferParent[part] = {};
                      }
                      transferParent = transferParent[part];
                  }
              }
              
              const lastPart = transferParts[transferParts.length - 1];
              const lastArrayMatch = lastPart.match(/^(.+)\[(\d+|N|\^)\]$/);
              
              if (lastArrayMatch) {
                  const arrayKey = lastArrayMatch[1];
                  const indexStr = lastArrayMatch[2];
                  
                  if (!Array.isArray(transferParent[arrayKey])) {
                      transferParent[arrayKey] = [];
                  }
                  const arr = transferParent[arrayKey];
                  
                  if (indexStr === "N") {
                      arr.push(transferredValue);
                  } else if (indexStr === "^") {
                      arr.unshift(transferredValue);
                  } else {
                      const index = parseInt(indexStr, 10);
                      if (!isNaN(index)) {
                          while (arr.length <= index) arr.push(undefined);
                          arr[index] = transferredValue;
                      }
                  }
              } else {
                  transferParent[lastPart] = transferredValue;
              }
              
              let wasDeleted = false;
              if (shouldDelete) {
                  if (Array.isArray(srcParent)) {
                      srcParent.splice(srcKey, 1);
                  } else {
                      delete srcParent[srcKey];
                  }
                  wasDeleted = true;
              }
              
              if (typeof client?.emitDataChange === "function") {
                  client.emitDataChange({
                          oldpath: path,
                          newpath: pathtransfer
                      },
                      transferredValue,
                      transferredValue,
                      wasDeleted ? "transfer-delete" : "transfer-keep"
                  );
              }
          }
      }
      
      if (Array.isArray(values.cases1)) {
          for (const dataCase of values.cases1) {
              if (dataCase.type !== "data") continue;
              const comparison = dataCase.data.comparisonlist?.[0];
              let matchesCriteria = true;
              
              if (comparison) {
                  const variable = bridge.get(comparison.data.variable);
                  const secondValue = bridge.transf(comparison.data.compareValue);
                  matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
              }
              if (matchesCriteria == true) {
                  const path = bridge.transf(dataCase.data.path);
                  const pathParts = path.split(".");
                  let current = data;
                  
                  for (let i = 0; i < pathParts.length - 1; i++) {
                      const part = pathParts[i];
                      
                      if (
                          /\[\d+\]$/.test(part) ||
                          part.endsWith("[N]") ||
                          part.endsWith("[^]")
                      ) {
                          const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
                          if (!arrayKeyMatch) break;
                          
                          const arrayKey = arrayKeyMatch[1];
                          const indexOrSymbol = arrayKeyMatch[2];
                          
                          if (!Array.isArray(current[arrayKey])) {
                              current = undefined;
                              break;
                          }
                          
                          const array = current[arrayKey];
                          let index;
                          
                          if (indexOrSymbol === "N") {
                              index = array.length - 1;
                          } else if (indexOrSymbol === "^") {
                              index = 0;
                          } else {
                              index = parseInt(indexOrSymbol, 10);
                              if (isNaN(index) || index >= array.length) {
                                  current = undefined;
                                  break;
                              }
                          }
                          
                          current = array[index];
                      } else {
                          if (!current[part]) {
                              current = undefined;
                              break;
                          }
                          current = current[part];
                      }
                  }
                  
                  if (!current) {
                      continue;
                  }
                  
                  const lastPart = pathParts[pathParts.length - 1];
                  const lastPartMatch = lastPart.match(/^(.+)\[(\d+|N|\^)\]$/);
                  
                  let deletedValue = undefined;
                  
                  if (lastPartMatch) {
                      const arrayKey = lastPartMatch[1];
                      const indexOrSymbol = lastPartMatch[2];
                      
                      if (!Array.isArray(current[arrayKey])) {
                          continue;
                      }
                      
                      const array = current[arrayKey];
                      
                      if (indexOrSymbol === "N" || indexOrSymbol === "^") {
                          if (array.length > 0) {
                              if (indexOrSymbol === "N") {
                                  deletedValue = array[array.length - 1];
                                  array.pop();
                              } else {
                                  deletedValue = array[0];
                                  array.shift();
                              }
                          }
                      } else {
                          const index = parseInt(indexOrSymbol, 10);
                          if (!isNaN(index) && index < array.length) {
                              deletedValue = array[index];
                              array.splice(index, 1);
                          }
                      }
                  } else {
                      if (current.hasOwnProperty(lastPart)) {
                          deletedValue = current[lastPart];
                          delete current[lastPart];
                      }
                  }
                  
                  if (typeof client?.emitDataChange === "function" && deletedValue !== undefined) {
                      client.emitDataChange(path, undefined, deletedValue, "delete");
                  }
              }
          }
      }
      
      if (values.logToConsole) {
          console.log(data);
      }
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  },
};
