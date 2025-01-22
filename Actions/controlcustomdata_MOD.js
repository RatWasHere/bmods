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
  ],

  compatibility: ["Any"],
  subtitle: (values, constants, thisAction) => {
    let numData = values.cases.filter((c) => c.type === "data").length;
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
    for (const dataCase of values.cases) {
      if (dataCase.type !== "data") continue;
      file.set(
        bridge.transf(dataCase.data.path),
        bridge.transf(dataCase.data.value)
      );
    }
    for (const dataCase of values.cases3) {
      if (dataCase.type !== "data") continue;
      file.append(
        bridge.transf(dataCase.data.path),
        bridge.transf(dataCase.data.value)
      );
    }
    for (const dataCase of values.cases1) {
      if (dataCase.type !== "data") continue;
      file.unset(bridge.transf(dataCase.data.path));
    }
    if (values.logToConsole) {
      console.log(file.get());
    }
  },
};
