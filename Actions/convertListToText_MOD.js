modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Convert List To Text PLUS",
  },
  category: "Lists",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Conversion",
      types: {
        options: "Conversion",
      },
      UItypes: {
        options: {
          name: "Conversion",
          inheritData: true,
          UI: [
            {
              element: "var",
              storeAs: "list",
              name: "List",
            },
            "_",
            {
              element: "store",
              name: "Store Result As",
              storeAs: "store",
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
      storeAs: "All the elements",
      types: {
        options: "All the elements",
      },
      UItypes: {
        options: {
          name: "All the elements",
          inheritData: true,
          UI: [
            {
              element: "largeInput",
              name: "The beginning of each element",
              storeAs: "istart",
            },
            "_",
            {
              element: "toggle",
              storeAs: "numero",
              name: "Specify the item number on each item",
              true: "Yes!",
              false: "Nono!",
            },
            "-",
            {
              element: "largeInput",
              name: "The middle of each element",
              storeAs: "start",
            },
            "-",
            {
              element: "largeInput",
              name: "The end of each element",
              storeAs: "endeval",
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
      storeAs: "Elements",
      types: {
        options: "Elements",
      },
      UItypes: {
        options: {
          name: "Elements",
          inheritData: true,
          UI: [
            {
              element: "input",
              name: "With each * element",
              storeAs: "multi",
            },
            {
              element: "largeInput",
              name: "Add to Top",
              storeAs: "istart2",
            },
            "-",
            {
              element: "largeInput",
              name: "Add to the middle",
              storeAs: "start2",
            },
            "-",
            {
              element: "largeInput",
              name: "Add to the end",
              storeAs: "end2",
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
      storeAs: "Change the elements",
      types: {
        options: "Change the elements",
      },
      UItypes: {
        options: {
          name: "Change the elements",
          inheritData: true,
          UI: [
            {
              element: "menu",
              storeAs: "cases",
              name: "Change the elements",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Change the elements",
                  preview: "`${option.data.comparisonlist?.[0] ? '⚠️' : ''}`",
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
                      storeAs: "posicao",
                      name: "Element position",
                    },
                    "-",
                    {
                      element: "largeInput",
                      name: "Add to Top",
                      storeAs: "start3",
                    },
                    "-",
                    {
                      element: "largeInput",
                      name: "Add to the end",
                      storeAs: "end3",
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
      storeAs: "Pages",
      types: {
        options: "Pages",
      },
      UItypes: {
        options: {
          name: "Pages",
          inheritData: true,
          UI: [
            {
              element: "input",
              name: "Limiting the number of elements on a page",
              storeAs: "limite",
              placeholder: "Leave it empty so it won't be used.",
            },
            "-",
            {
              element: "input",
              name: "Page",
              storeAs: "pagina",
            },
            "-",
            {
              element: "store",
              name: "Store Total pages As",
              storeAs: "storagept",
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

  subtitle: (data, constants) => {
    return `List [${constants.variable(
      data.list
    )}] convert to text - Store Result As ${constants.variable(data.store)}`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let list = await bridge.get(values.list);

    const start = bridge.transf(values.start).replace("\\n", "\n");
    const istart = bridge.transf(values.istart).replace("\\n", "\n");

    var totaldeitens = list.length;

    var irseguir = 0;

    var pagina = bridge.transf(values.pagina);
    if (
      pagina == "" ||
      pagina == "undefined" ||
      pagina == undefined ||
      pagina == null
    ) {
      pagina = 1;
    } else {
      pagina = parseFloat(bridge.transf(values.pagina));
      if (pagina > 0) {
      } else {
        pagina = 1;
      }
      list = list.slice(0, limite);
    }

    const multi = parseFloat(bridge.transf(values.multi));
    var limite = bridge.transf(values.limite);
    if (
      limite == "" ||
      limite == "undefined" ||
      limite == undefined ||
      limite == null
    ) {
      limite = "";
      limiteoff = "off";
    } else {
      limite = parseFloat(bridge.transf(values.limite));

      if (limite > 0) {
      } else {
        limite = 10;
      }

      var paginatotal = Math.ceil(totaldeitens / limite);

      bridge.store(values.storagept, paginatotal);

      if (pagina > paginatotal) {
        pagina = paginatotal;
      }
      if (pagina <= 0) {
        pagina = 1;
      }

      var irseguir = Math.ceil(pagina * limite - limite);

      const indiceFim = irseguir + limite;

      list = list.slice(irseguir, indiceFim);
    }

    const istart2 = bridge.transf(values.istart2).replace("\\n", "\n");
    const start2 = bridge.transf(values.start2).replace("\\n", "\n");
    const end2 = bridge.transf(values.end2).replace("\\n", "\n");

    let result = "";
    acont = -1;
    acont = acont + multi;

    for (let i = 0; i <= list.length - 1; i++) {
      resultitem = "";
      resultitem2 = "";

      if (values.numero == true) {
        resultitem = parseFloat(parseFloat([i + irseguir]) + 1) + resultitem;
        resultitem2 = parseFloat(parseFloat([i + irseguir]) + 1) + resultitem2;
      }

      if (acont == [i] && multi > 0) {
        acont = acont + multi;
        resultitem =
          istart2 +
          istart +
          resultitem +
          start +
          start2 +
          String(list[i]) +
          end2;
        resultitem2 = istart2 + istart + resultitem2 + start + start2 + end2;
      } else {
        resultitem = istart + resultitem + start + String(list[i]);
        resultitem2 = istart + resultitem2 + start;
      }

      if (Array.isArray(values.cases)) {
        for (const dataCase of values.cases) {
          if (dataCase.type !== "data") continue;
          const posicao = parseFloat(bridge.transf(dataCase.data.posicao));
          if (posicao == i + irseguir) {
            let matchesCriteria = true;

            if (
              dataCase.data.comparisonlist &&
              dataCase.data.comparisonlist[0]
            ) {
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
              const start3 = bridge
                .transf(dataCase.data.start3)
                .replace("\\n", "\n");
              const end3 = bridge
                .transf(dataCase.data.end3)
                .replace("\\n", "\n");
              resultitem = start3 + resultitem + end3;
              resultitem2 = start3 + resultitem2 + end3;
            }
          }
        }
      }

      result += resultitem + bridge.transf(values.endeval);
    }

    if (result) {
      bridge.store(values.store, result);
    }
  },
};
