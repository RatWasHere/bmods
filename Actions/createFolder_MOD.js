module.exports = {
  data: {
    name: "Create Folder",
  },
  category: "Files",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path",
    },
  ],
  subtitle: (data) => {
    return `Path: ${data.path}`;
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let fs = bridge.fs;

    fs.mkdirSync(bridge.file(values.path), { recursive: true });
  },
};
