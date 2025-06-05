modVersion = "s.v1.0"
module.exports = {
  data: { name: "Delete Role Data", source: { type: "string", value: "" } },
  category: "Role Data",
  info: {
      source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
      creator: "Acedia",
      donate: "https://ko-fi.com/slothyacedia"
  },
  UI: [
    {
      element: "role",
      storeAs: "role",
      name: "Role"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "deleteType",
      extraField: "delete",
      name: "Delete Type",
      choices: [
        { name: "All Data" },
        { name: "Specific Data", placeholder: "Data Name", field: true },
      ]
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `ROle: ${constants.role(values.role)} - ${values.deleteType}`
  },
  async run(values, message, client, bridge) {

    // initialize roles if it doesnt exist
    const path = require("node:path")
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      projectFolder = botData.prjSrc
    } else {projectFolder = workingDir}

    let storedPath = path.join(projectFolder, "AppData", "ToolKit", "storedData.json")
    let storedData = JSON.parse(bridge.fs.readFileSync(storedPath))

    if (!storedData.roles){
      storedData.roles = {}
      bridge.fs.writeFileSync(storedPath, JSON.stringify(storedData))
    }

    storedData = bridge.data.IO.get();

    let role = await bridge.getRole(values.role);

    if (values.deleteType == 'All Data') {
      delete storedData.roles[role.id];
    } else {
      delete storedData.roles[role.id][bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};