modVersion = "v1.0.0";
module.exports = {
  data: { name: "" },
  category: "",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label (optional)",
    },
    "-",
    {
      element: "role",
      storeAs: "role",
      name: "Role",
    },
    {
      element: "input",
      storeAs: "defaultval",
      name: "Default Value",
    },
    "-",
    {
      element: "menu",
      storeAs: "retrievelist",
      name: "List of Role Datas",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes: {
        data: {
          data: {},
          name: "Data Name:",
          preview: "`${option.data.dataname}`",
          UI: [
            {
              element: "input",
              storeAs: "dataname",
              name: "Data Name",
            },
            {
              element: "store",
              storeAs: "store",
              name: "Store As",
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
  subtitle: (values, constants) => {
    return `Retrieve ${values.retrievelist.length} datas of ${constants.role(
      values.role
    )}.`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // initialize roles if it doesnt exist
    const path = require("node:path");
    const botData = require("../data.json");
    const workingDir = path.normalize(process.cwd());
    let projectFolder;
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc;
    } else {
      projectFolder = workingDir;
    }

    let storedPath = path.join(projectFolder, "AppData", "ToolKit", "storedData.json")
    let storedData = JSON.parse(bridge.fs.readFileSync(storedPath))

    if (!storedData.roles){
      storedData.roles = {}
      bridge.fs.writeFileSync(storedPath, JSON.stringify(storedData))
    }

    storedData = bridge.data.IO.get();
    let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : "";
    let role = await bridge.getRole(values.role);

    for (let item of values.retrievelist) {
      let roleData = defaultVal;

      const dataName = item.data.dataname;
      const storeLocation = item.data.store;

      try {
        const getDataName = bridge.transf(dataName);

        if (
          storedData.roles &&
          storedData.roles[roles.id] &&
          storedData.roles[role.id][getDataName]
        ) {
          roleData = storedData.roles[role.id][getDataName];
        }
      } catch (error) {
        storedData.roles[role.id] = {};
        bridge.data.IO.write(storedData);
      }

      bridge.store(storeLocation, roleData);
    }
  },
};
