modVersion = "v1.1.0";

module.exports = {
  modules: ["edit-json-file"],
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
                  data: { query: "", value: "" },
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

    const editJsonFile = await client.getMods().require("edit-json-file");

    let file = editJsonFile(dbPath, {
      autosave: true,
    });
    if (values.deleteJson) {
      file.empty();
    }

    if (Array.isArray(values.cases)) {
    for (const dataCase of values.cases) {
      if (dataCase.type !== "data") continue;
      file.set(
        bridge.transf(dataCase.data.path),
        bridge.transf(dataCase.data.value)
      );
    };
    };
    if (Array.isArray(values.cases3)) {
    for (const dataCase of values.cases3) {
      if (dataCase.type !== "data") continue;
      file.append(
        bridge.transf(dataCase.data.path),
        bridge.transf(dataCase.data.value)
      );
    };
    };
    if (Array.isArray(values.cases4)) {
      for (const dataCase of values.cases4) {
        switch (dataCase.type) {
          case 'value':
            let cases5 = dataCase.data.cases5;

            let res = cases5.reduce((acc, item) => {
              if (item.type === "data" && item.data && item.data.name && item.data.value) {
                acc[bridge.transf(item.data.name)] = bridge.transf(item.data.value);
              }
              return acc;
            }, {});

            let resu;
            if (dataCase.data.name) {
              resu = {
                [bridge.transf(dataCase.data.name)]: res
              };
            } else {
              resu = res;
            }

            file.set(
              bridge.transf(dataCase.data.path),
              resu
            );
            break;
          case 'array':
            let cases6 = dataCase.data.cases6;

            let result = cases6.reduce((acc, item) => {
              if (item.type === "data" && item.data && item.data.name && item.data.value) {
                acc[bridge.transf(item.data.name)] = bridge.transf(item.data.value);
              }
              return acc;
            }, {});
            file.append(bridge.transf(dataCase.data.path), result);
           break;
        }
      }
    };
    if (Array.isArray(values.cases1)) {
    for (const dataCase of values.cases1) {
      if (dataCase.type !== "data") continue;
      file.unset(bridge.transf(dataCase.data.path));
    };
  }
  if (values.logToConsole) {
      console.log(file.get());
    }
  },
};
