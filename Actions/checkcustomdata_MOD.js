modVersion = "v2.0.1";

module.exports = {
  data: {
    name: "Check Custom Data",
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
