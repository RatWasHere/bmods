module.exports = {
  data: {
    name: "Control File Lines",
  },
  category: "Files",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat",
  },
  UI: [
    {
      element: "input",
      storeAs: "path",
      name: "Path",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "action",
      name: "Action",
      extraField: "actionContent",
      choices: [
        { name: "Insert At Line", field: true, placeholder: "Line Number" },
        { name: "Overwrite Line", field: true, placeholder: "Line Number" },
        { name: "Delete Line", field: true, placeholder: "Line Number" },
      ],
    },
    {
      storeAs: "content",
      name: "Content",
    },
  ],
  script: (data) => {
    data.events.on("change", () => {
      if (data.data.action == "Delete Line") {
        data.UI[3].element = " ";
      } else {
        data.UI[3].element = "input";
      }
      data.updateUI();
    });
  },
  subtitle: (values, constants) => {
    return `${values.action} (${values.actionContent}) - ${values.path}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let filePath = bridge.file(values.path);
    let file = bridge.fs.readFileSync(filePath, "utf8");
    let lines = file.split("\n");
    let lineNumber = Number(bridge.transf(values.actionContent)) - 1;

    if (values.action == "Delete Line") {
      lines.splice(lineNumber, 1);
    } else if (values.action == "Insert At Line") {
      lines.splice(lineNumber, 0, bridge.transf(values.content));
    } else if (values.action == "Overwrite Line") {
      lines[lineNumber] = bridge.transf(values.content);
    }

    bridge.fs.writeFileSync(filePath, lines.join("\n"));
  },
};
