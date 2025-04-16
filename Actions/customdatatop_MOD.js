modVersion = "v2.1.1";

module.exports = {
  data: {
    name: "Custom Data Top",
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
    function refreshElements() {
      if (data.data.resultType == "All Results") {
        data.UI[8].element = " ";
      } else if (data.data.resultType == "Range") {
        data.UI[8].element = "inputGroup";
        data.UI[8].nameSchemes = ["Start", "End"];
        data.UI[8].storeAs = ["rangeStart", "rangeEnd"];
        data.UI[8].placeholder = [
          "Start index (Lists Start At 0)",
          "End index",
        ];
      } else if (data.data.resultType == "Top N Results") {
        data.UI[8].element = "input";
        data.UI[8].storeAs = "rangeStart";
        data.UI[8].name = "Start";
        data.UI[8].placeholder = "Start index (Lists Start At 0)";
      } else if (data.data.resultType == "Bottom N Results") {
        data.UI[8].element = "input";
        data.UI[8].name = "End";
        data.UI[8].storeAs = "rangeEnd";
        data.UI[8].placeholder = "End index";
      }

      if (data.data.formatType == "The created array is top") {
        data.UI[14].element = " ";
      } else if (data.data.formatType == "Custom text as a list") {
        data.UI[14].element = "input";
      }

      setTimeout(() => {
        data.updateUI();
      }, data.commonAnimation * 100);
    }

    refreshElements();
    data.events.on("change", () => {
      refreshElements();
    });
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
