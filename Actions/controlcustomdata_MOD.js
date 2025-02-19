modVersion = "v2.0.0";

module.exports = {
  data: {
    name: "Control Custom Data",
  },
  category: "Custom Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
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
            header: true
          },
          {
            element: "text",
            text: `Send the final file to the console.`
          },
          "-",
          {
            element: "text",
            text: "Clear contents JSON file?",
            header: true
          },
          {
            element: "text",
            text: `Clear the file at the beginning. before further editing.`
          }
        ]
    }
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
                    header: true
                  },
                  {
                    element: "text",
                    text: `You can create both values and values in objects.`
                  },
                ]
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
                    "`Query: ${option.data.path} - ${option.data.value}`",
                  data: { path: "", value: "" },
                  UI: [
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
        storeAs: "Create Data Array",
        types: {
          options: "Create Data Array",
        },
        UItypes: {
          options: {
            name: "Create Data Array",
            inheritData: true,
            UI: [
              {
                element: "menu",
                help: {
                  title: "Create Data Array?",
                  UI: [
                    {
                      element: "text",
                      text: "Create Data Array?",
                      header: true
                    },
                    {
                      element: "text",
                      text: `You can create a value in an array.`
                    },
                  ]
              },
                storeAs: "cases3",
                name: "Create Data Array",
                types: {
                  data: "Data",
                },
                max: 200,
                UItypes: {
                  data: {
                    name: "Create Data Array",
                    preview:
                      "`Query: ${option.data.path} - ${option.data.value}`",
                    data: { path: "", value: "" },
                    UI: [
                      {
                        element: "input",
                        storeAs: "path",
                        name: "Path",
                      },
                      "-",
                      {
                        element: "input",
                        storeAs: "value",
                        name: "Name",
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
                        header: true
                      },
                      {
                        element: "text",
                        text: `You can use this feature to create an object from scratch. And if it exists, it will be completely overwritten with a new one.`
                      },
                    ]
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
                        "`Query: ${option.data.path} - ${option.data.name}`",
                      data: { path: "", name: "" },
                      UI: [
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
                                "`Query: ${option.data.path} - ${option.data.value}`",
                              data: { name: "", value: "" },
                              UI: [
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
                        "`Query: ${option.data.path}`",
                      data: {},
                      UI: [
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
                                "`Query: ${option.data.name} - ${option.data.value}`",
                              data: { name: "", value: "" },
                              UI: [
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
                    header: true
                  },
                  {
                    element: "text",
                    text: `You can delete the data in json.`
                  },
                ]
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
                  preview: "`Path: ${option.data.patch}`",
                  data: { patch: "" },
                  UI: [
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
  subtitle: (values, constants, thisAction) => {
    const checkAndCount = (arr) => Array.isArray(arr) ? arr.length : 0;
    let numData1 = checkAndCount(values.cases);
    let numData2 = checkAndCount(values.cases1);
    let numData3 = checkAndCount(values.cases2);
    let numData4 = checkAndCount(values.cases3);
    let numData5 = checkAndCount(values.cases4);

    let numData = numData1 + numData2 + numData3 + numData4 + numData5;

    return `Controlling ${numData} Data(s)`;
  },
  async run(values, message, client, bridge) {
    let dbPath = bridge.file(values.database);
    let fs = bridge.fs;

    if (values.deleteJson) {
      fs.writeFileSync(dbPath, '{}', 'utf8');
    }

    let data = {};
    if (fs.existsSync(dbPath)) {
      const rawData = fs.readFileSync(dbPath, 'utf8');
      data = JSON.parse(rawData);
    }
    
    if (Array.isArray(values.cases)) {
      for (const dataCase of values.cases) {
        if (dataCase.type !== "data") continue;
    
        const rawPath = bridge.transf(dataCase.data.path);
        const value = bridge.transf(dataCase.data.value);
    
        const pathParts = rawPath.split('.');
    
        let current = data;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
    
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
    
          current = current[part];
        }
    
        const lastPart = pathParts[pathParts.length - 1];
    
        if (typeof current[lastPart] === 'object' && typeof value === 'object') {
          current[lastPart] = { ...current[lastPart], ...value };
        } else {
          current[lastPart] = value;
        }
      }
    }

    if (Array.isArray(values.cases3)) {
      for (const dataCase of values.cases3) {
        if (dataCase.type !== "data") continue;
    
        const rawPath = bridge.transf(dataCase.data.path);
        const value = bridge.transf(dataCase.data.value);
    
        const pathParts = rawPath.split('.');
    
        let current = data;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
    
          if (/\[\d+\]$/.test(part) || part.endsWith('[N]') || part.endsWith('[^]')) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
            if (!arrayKeyMatch) continue;
    
            const arrayKey = arrayKeyMatch[1];
            const indexOrSymbol = arrayKeyMatch[2];
    
            if (!Array.isArray(current[arrayKey])) {
              current[arrayKey] = [];
            }
    
            current = current[arrayKey];
    
            if (indexOrSymbol === 'N') {
              const nextPart = pathParts[i + 1];
              if (nextPart) {
                current.push({});
                current = current[current.length - 1];
              } else {
                current.push(value);
              }
              continue;
            }
    
            if (indexOrSymbol === '^') {
              if (current.length > 0) {
                const lastElement = current[current.length - 1];
                if (typeof lastElement !== 'object' || lastElement === null) {
                  current[current.length - 1] = {};
                }
                current = current[current.length - 1];
              } else {
                current.push({});
                current = current[current.length - 1];
              }
              continue;
            }
    
            const index = parseInt(indexOrSymbol, 10);
            if (isNaN(index)) continue;
    
            while (current.length <= index) {
              current.push(null);
            }
    
            if (typeof current[index] !== 'object' || current[index] === null) {
              current[index] = {};
            }
    
            current = current[index];
          } else {
            if (!current[part] || typeof current[part] !== 'object') {
              current[part] = {};
            }
    
            current = current[part];
          }
        }
    
        const lastPart = pathParts[pathParts.length - 1];
    
        const lastPartMatch = lastPart.match(/^(.+)\[(\d+|N|\^)\]$/);
        if (lastPartMatch) {
          const arrayKey = lastPartMatch[1];
          const indexOrSymbol = lastPartMatch[2];
    
          if (!Array.isArray(current[arrayKey])) {
            current[arrayKey] = [];
          }
    
          const array = current[arrayKey];
    
          if (indexOrSymbol === 'N') {
            array.push(value);
          } else if (indexOrSymbol === '^') {
            if (array.length > 0) {
              const lastElement = array[array.length - 1];
              if (typeof lastElement !== 'object' || lastElement === null) {
                array[array.length - 1] = {};
              }
              Object.assign(array[array.length - 1], value);
            } else {
              array.push(value);
            }
          } else {
            const index = parseInt(indexOrSymbol, 10);
            if (isNaN(index)) continue;
    
            while (array.length <= index) {
              array.push(null);
            }
    
            if (typeof value === 'string') {
              array[index] = value;
            } else if (typeof value === 'object') {
              if (typeof array[index] !== 'object' || array[index] === null) {
                array[index] = {};
              }
              Object.assign(array[index], value);
            } else {
              array[index] = value;
            }
          }
        } else {
          current[lastPart] = value;
        }
      }
    }

    if (Array.isArray(values.cases4)) {
      for (const dataCase of values.cases4) {
        switch (dataCase.type) {
          case 'value':
            if (Array.isArray(dataCase.data?.cases5)) {
              const res = dataCase.data.cases5.reduce((acc, item) => {
                if (
                  item.type === "data" &&
                  item.data &&
                  typeof item.data.name === 'string' &&
                  typeof item.data.value !== 'undefined'
                ) {
                  acc[bridge.transf(item.data.name)] = bridge.transf(item.data.value);
                }
                return acc;
              }, {});
    
              const resu = dataCase.data.name
                ? { [bridge.transf(dataCase.data.name)]: res }
                : res;
    
              const pathParts = bridge.transf(dataCase.data.path).split('.');
              let current = data;
    
              for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (!current[part]) {
                  current[part] = {};
                }
                current = current[part];
              }
    
              const lastPart = pathParts[pathParts.length - 1];
              current[lastPart] = resu;
            }
            break;
    
          case 'array':
            if (Array.isArray(dataCase.data?.cases6)) {
              const result = dataCase.data.cases6.reduce((acc, item) => {
                if (
                  item.type === "data" &&
                  item.data &&
                  typeof item.data.name === 'string' &&
                  typeof item.data.value !== 'undefined'
                ) {
                  acc[bridge.transf(item.data.name)] = bridge.transf(item.data.value);
                }
                return acc;
              }, {});
    
              const pathParts = bridge.transf(dataCase.data.path).split('.');
              let current = data;
    
              for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (!current[part]) {
                  current[part] = {};
                }
                current = current[part];
              }
    
              const lastPart = pathParts[pathParts.length - 1];
              if (!Array.isArray(current[lastPart])) {
                current[lastPart] = [];
              }
              current[lastPart].push(result);
            }
            break;
        }
      }
    }

    if (Array.isArray(values.cases1)) {
      for (const dataCase of values.cases1) {
        if (dataCase.type !== "data") continue;
    
        const path = bridge.transf(dataCase.data.path);
        const pathParts = path.split('.');
        let current = data;
    
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
    
          if (/\[\d+\]$/.test(part) || part.endsWith('[N]') || part.endsWith('[^]')) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
            if (!arrayKeyMatch) continue;
    
            const arrayKey = arrayKeyMatch[1];
            const indexOrSymbol = arrayKeyMatch[2];
    
            if (!Array.isArray(current[arrayKey])) {
              break;
            }
    
            const array = current[arrayKey];
    
            if (indexOrSymbol === 'N' || indexOrSymbol === '^') {
              if (array.length > 0) {
                array.pop();
              }
            } else {
              const index = parseInt(indexOrSymbol, 10);
              if (isNaN(index) || index >= array.length) break;
    
              array.splice(index, 1);
            }
    
            current = array;
          } else {
            if (!current[part]) {
              break;
            }
    
            current = current[part];
          }
        }
    
        const lastPart = pathParts[pathParts.length - 1];
    
        const lastPartMatch = lastPart.match(/^(.+)\[(\d+|N|\^)\]$/);
        if (lastPartMatch) {
          const arrayKey = lastPartMatch[1];
          const indexOrSymbol = lastPartMatch[2];
    
          if (!Array.isArray(current[arrayKey])) {
            continue;
          }
    
          const array = current[arrayKey];
    
          if (indexOrSymbol === 'N' || indexOrSymbol === '^') {
            if (array.length > 0) {
              array.pop();
            }
          } else {
            const index = parseInt(indexOrSymbol, 10);
            if (isNaN(index) || index >= array.length) continue;
    
            array.splice(index, 1);
          }
        } else {
          delete current[lastPart];
        }
      }
    }

  if (values.logToConsole) {
      console.log(data);
    }
 fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  },
};
