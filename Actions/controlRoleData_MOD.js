modVersion = "v1.0.0"
module.exports = {
  data: { name: "Control Role Data", source: { type: "string", value: "" } },
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
      element: "dropdown",
      name: "Control",
      storeAs: "control",
      extraField: "controlValue",
      choices: [
        {name: "Add To Value", placeholder: "Value To Add", field: true},
        {name: "Overwrite", placeholder: "New Value", field: true},
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
    return `Data Name: ${values.dataName} - ${values.control} (${values.controlValue})`
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

    let type = 'roles'

    let role = await bridge.getRole(values.role);
    let id = role.id;

    let currentData = '';

    if (!storedData[type][id]) {
      storedData[type][id] = {};
    }

    let dataName = bridge.transf(values.dataName);

    if (storedData[type][id][dataName]) {
      currentData = storedData[type][id][dataName]
    }
    
    if (values.control == 'Add To Value') {
      if (parseFloat(currentData) != NaN && parseFloat(bridge.transf(values.controlValue)) != NaN && currentData && values.controlValue) {
        currentData = Number(currentData) + Number(bridge.transf(values.controlValue))
      } else {
        currentData = `${currentData}${bridge.transf(values.controlValue)}`
      }
    } else {
      currentData = bridge.transf(values.controlValue)
    }

    storedData[type][id][dataName] = currentData;
    bridge.data.IO.write(storedData);
  },
};