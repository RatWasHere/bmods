modVersion = "v2.0.0";

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
                      nameSchemes: ["Exclude objects", "Exclude lines"]
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
    const checkAndCount = (arr) => Array.isArray(arr) ? arr.length : 0;
    let numData1 = checkAndCount(values.cases);
    let numData2 = checkAndCount(values.cases1);

    let numData = numData1 + numData2;

    return `Getting ${numData} Information(s)`;
  },
  async run(values, message, client, bridge) {
    let dbPath = bridge.file(values.database);
    let fs = bridge.fs;

    let data = {};
    if (fs.existsSync(dbPath)) {
      const rawData = fs.readFileSync(dbPath, 'utf8');
      data = JSON.parse(rawData);
}

if (Array.isArray(values.cases)) {
  for (const dataCase of values.cases) {
    if (dataCase.type !== "data") continue;

    const path = bridge.transf(dataCase.data.Path);
    const pathParts = path.split('.');
    let current = data;

    for (const part of pathParts) {
      if (/\[\d+\]$/.test(part) || part.endsWith('[N]') || part.endsWith('[^]')) {
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

        if (indexOrSymbol === 'N' || indexOrSymbol === '^') {
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
        if (!current || typeof current !== 'object') {
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

    const path = bridge.transf(dataCase.data.Path);
    const pathParts = path.split('.');
    let current = data;

    for (const part of pathParts) {
      if (/\[\d+\]$/.test(part) || part.endsWith('[N]') || part.endsWith('[^]')) {
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

        if (indexOrSymbol === 'N' || indexOrSymbol === '^') {
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
        if (!current || typeof current !== 'object') {
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

    if (current && typeof current === 'object') {
      if (dataCase.data.objects) {
        for (let key in current) {
          if (!(typeof current[key] === 'object')) {
            names.push(key);
          }
        }
      } else if (dataCase.data.lines) {
        for (let key in current) {
          if (typeof current[key] !== 'string') {
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
  }
};
