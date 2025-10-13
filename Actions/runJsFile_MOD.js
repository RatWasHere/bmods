/*
    Run Js File mod by LikRus
    Licensed under MIT License

    Using this action, you can play the code from the files.
*/
modVersion = "v1.1.0";

module.exports = {
  data: {
    name: "Run Js File",
  },
  modules: ["node:path"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    description: "Using this action, you can play the code from the files.",
    donate: "https://boosty.to/cactus/donate",
  },
  category: "Control",
  UI: [
    {
      element: "input",
      storeAs: "file",
      name: "File JS",
      placeholder: "path/to/script.js"
    },  
    "_",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Data variables",
      types: {
        options: "Data variables",
      },
      UItypes: {
        options: {
          name: "Data variables",
          inheritData: true,
          UI: [
            {
              element: "menu",
              storeAs: "cases",
              name: "Data variables",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Data variables",
                  preview: "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Name: ${option.data.name} | Text: ${option.data.text}`",
                  data: { name: "", text: ""},
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
                      storeAs: "text",
                      name: "Text",
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    "_",
    {
      element: "toggle",
      storeAs: "console",
      name: "Output the error to the console?",
      true: "Yes!",
      false: "Nono!"
    },
    "-",
    {
      element: "storage",
      storeAs: "store",
      name: "Store result As",
      help: {
        title: "Store result As?",
        UI: [
          {
            element: "text",
            text: "What is transmitted to the result?",
            header: true,
          },
          {
            element: "text",
            text: `In Json format from the code for example:`
          },
          {
            element: "text",
            text: `module.exports = {`,
          },
          {
            element: "text",
            text: `user,`,
          },
          {
            element: "text",
            text: `version,`,
          },
          {
            element: "text",
            text: `items,`,
          },
          {
            element: "text",
            text: `isActive`,
          },
          {
            element: "text",
            text: `};`,
          },
        ],
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `Run the code from the file: ${values.file} - Store result As: ${constants.variable(values.store)}`;
  },

  async run(values, interaction, client, bridge) {
      for (const moduleName of this.modules) {
          await client.getMods().require(moduleName);
      }
      
      const path = require("node:path");
      let destination = path.normalize(bridge.transf(values.file));
      
      const botData = require("../data.json");
      const workingDir = path.normalize(process.cwd());
      let projectFolder;
      if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
          projectFolder = botData.prjSrc;
      } else {
          projectFolder = workingDir;
      }
      
      let fullPath = path.join(projectFolder, destination);
      
      function matchesComparator(variable, comparator, secondValue) {
          switch (comparator) {
              case "Equals":
                  return `${variable}` == `${secondValue}`;
              case "Doesn't Equal":
                  return variable != secondValue;
              case "Exists":
                  return variable !== null && variable !== undefined && variable !== "";
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
                  return !isNaN(Number(variable)) && variable !== "";
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
      
      const variables = {};
      
      if (Array.isArray(values.cases)) {
          for (const dataCase of values.cases) {
              const comparison = dataCase.data.comparisonlist?.[0];
              let matchesCriteria = true;
              
              if (comparison) {
                  const variable = bridge.get(comparison.data.variable);
                  const secondValue = bridge.transf(comparison.data.compareValue);
                  matchesCriteria = matchesComparator(variable, comparison.data.comparator, secondValue);
              }
              
              if (matchesCriteria) {
                  const name = bridge.transf(dataCase.data.name);
                  const text = bridge.transf(dataCase.data.text);
                  variables[name] = text;
              }
          }
      }
      
      async function runAndGet(filePath) {
          try {
              const resolved = require.resolve(filePath);
              delete require.cache[resolved];
              
              const exported = require(filePath);
              
              if (typeof exported === "function") {
                  return await exported(values, interaction, client, bridge, variables);
              }
              
              return exported;
          } catch (error) {
              if (values.console) console.error(error);
              return null;
          }
      }
      
      const result = await runAndGet(fullPath);
      
      if (result !== null && result !== undefined) {
          bridge.store(values.store, result);
      }
  }
};
