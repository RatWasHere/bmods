module.exports = {
    modules: ["edit-json-file"],
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
          options: "Store Data"
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
                    preview: "`Path: ${option.data.Path} - ${option.data.store}`",
                    data: { query: "" , value: "" },
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
    ],
  
    compatibility: ["Any"],
    subtitle: (values, constants, thisAction) => {
      let numData = values.cases.filter((c) => c.type === "data").length;
      return `Getting ${numData} Information(s)`;
    },
    run(values, message, client, bridge) {
        let dbPath = bridge.file(values.database);

        const editJsonFile = client.getMods().require("edit-json-file");

        let file = editJsonFile(dbPath, {
          autosave: true
      });
      for (const dataCase of values.cases) {
        if (dataCase.type !== "data") continue;
        let output;
        output = file.get(bridge.transf(dataCase.data.Path))
        bridge.store(dataCase.data.store, output);
      };
      if (values.logToConsole) {
        console.log(file.get());
      }
    },
  };