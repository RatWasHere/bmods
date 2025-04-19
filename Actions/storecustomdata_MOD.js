modVersion = "v2.2.0";

module.exports = {
  data: {
    name: "Store Custom Data",
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

        for (const part of pathParts) {
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
          if (/\[\d+\]$/.test(part) || part.endsWith("[N]") || part.endsWith("[^]")) {
            const arrayKeyMatch = part.match(/^(.+)\[(\d+|N|\^)\]$/);
            if (!arrayKeyMatch) break;
            const [arrayKey, indexOrSymbol] = [arrayKeyMatch[1], arrayKeyMatch[2]];
            if (!Array.isArray(current[arrayKey])) break;
            const array = current[arrayKey];
            current = indexOrSymbol === "N" || indexOrSymbol === "^" 
              ? array[array.length - 1]
              : array[parseInt(indexOrSymbol, 10)];
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
