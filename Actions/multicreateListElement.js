modVersion = "v1.0.1";

module.exports = {
  category: "Lists",
  data: { name: "Multi Create List Element" },
  aliases: [
    "Add Element To List",
    "Create List Entry",
    "List Add",
    "Add To List",
    "Add Entry To List",
    "Push To List",
    "Push Element To List",
    "Push Entry To List",
    "New List Item",
    "Expand List",
    "Introduce List Item",
    "Introduce List Element",
  ],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "variableInsertion",
      storeAs: "list",
      name: "List",
    },
    "_",
    {
      element: "menu",
      storeAs: "cases",
      name: "Create List Element",
      types: {
        data: "Data",
      },
      max: 200,
      UItypes: {
        data: {
          name: "Create List Element",
          preview:
            "`${option.data.comparisonlist?.[0] ? '⚠️' : ''} Create ${option.data.format}: ${option.data.value.type !== 'string' ? `${option.data.value.type}(${option.data.value.value})` : `${option.data.value.value}`}`",
          data: { status: "false" },
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
              element: "halfDropdown",
              storeAs: "format",
              extraField: "formatValue",
              name: "Format",
              choices: [
                {
                  name: "Add at the end",
                },
                {
                  name: "Add at the beginning",
                },
                {
                  name: "Add to a random position",
                },
                {
                  name: "Add to a specific position",
                  field: true,
                  placeholder: "Position",
                },
              ],
            },
            {
              element: "var",
              storeAs: "value",
              name: "Element Value",
              also: {
                string: "Text",
              },
            },
          ],
        },
      },
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, data, constants) => {
    const checkAndCount = (arr) => (Array.isArray(arr) ? arr.length : 0);
    let numData = checkAndCount(values.cases);
    return `Create list ${numData} Element(s)`;
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    let list = bridge.get(values.list);

    if (Array.isArray(values.cases)) {
      for (const dataCase of values.cases) {
        if (dataCase.type !== "data") continue;
        let matchesCriteria = true;

        if (dataCase.data.comparisonlist && dataCase.data.comparisonlist[0]) {
          matchesCriteria = false;
          let variable = bridge.get(
            dataCase.data.comparisonlist[0].data.variable
          );
          let secondValue = bridge.transf(
            dataCase.data.comparisonlist[0].data.compareValue
          );

          switch (dataCase.data.comparisonlist[0].data.comparator) {
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
              matchesCriteria = variable != null || variable != undefined;
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
                typeof parseInt(variable) == "number" &&
                `${parseInt(variable)}` != `NaN`
              ) {
                matchesCriteria = true;
              }
              break;

            case "Matches Regex":
              matchesCriteria = Boolean(
                variable.match(new RegExp("^" + secondValue + "$", "i"))
              );
              break;

            case "Exactly includes":
              if (typeof variable?.toString().includes === "function") {
                matchesCriteria = variable.toString().includes(secondValue);
              }
              break;
          }
        }
        if (matchesCriteria == true) {
          let dataOverwrite;
          if (typeof dataCase.data.value == "string") {
            dataOverwrite = bridge.transf(dataCase.data.value);
          } else {
            if (dataCase.data.value.type == "string") {
              dataOverwrite = bridge.transf(dataCase.data.value.value);
            } else {
              dataOverwrite = bridge.get(dataCase.data.value);
            }
          }
          switch (dataCase.data.format) {
            case "Add at the end":
              list.push(dataOverwrite);
              break;
            case "Add at the beginning":
              list.unshift(dataOverwrite);
              break;
            case "Add to a specific position":
              if (dataCase.data.formatValue < 0) {
                list.unshift(dataOverwrite);
              } else if (dataCase.data.formatValue >= list.length) {
                list.push(dataOverwrite);
              } else {
                list.splice(dataCase.data.formatValue, 0, dataOverwrite);
              }
              break;
            case "Add to a random position":
              positionvalue = Math.abs(parseInt(Math.random() * list.length));

              if (positionvalue < 0) {
                list.unshift(dataOverwrite);
              } else if (positionvalue >= list.length) {
                list.push(dataOverwrite);
              } else {
                list.splice(positionvalue, 0, dataOverwrite);
              }
              break;
          }
        }
      }
    }
  },
};
