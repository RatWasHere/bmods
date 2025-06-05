modVersion = "s.v1.0"
module.exports = {
  data: { name: "Store Role Data", source: { type: "string", value: "" } },
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
      element: "input",
      storeAs: "dataName",
      name: "Data Name",
      placeholder: "Key",
    },
    "_",
    {
      element: "var",
      storeAs: "source",
      name: "New Value",
      also: {
        string: "Text",
      },
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    let newValue = values.source;
    if (newValue.type == 'string') {
      newValue = newValue.value;
    } else {
      newValue = constants.variable(newValue);
    }
    return `Role: ${constants.role(values.role)} - Data Name: ${values.dataName} - New Value: ${newValue}`
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

    let dataOverwrite;

    if (!values.source) {
      dataOverwrite = bridge.transf(values.dataValue);
    } else {
      if (values.source.type == "string") {
        dataOverwrite = bridge.transf(values.source.value);
      } else {
        dataOverwrite = bridge.get(values.source);
      }
    }

    if (!storedData.roles[role.id]) {
      storedData.roles[role.id] = {};
    }

    storedData.roles[role.id][bridge.transf(values.dataName)] = dataOverwrite;
    bridge.data.IO.write(storedData);
  },
};