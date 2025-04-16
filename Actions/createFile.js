modVersion = "s.v1.0 | AceFix";
module.exports = {
  data: {
    name: "Create File",
  },
  category: "Files",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path",
    },
    "-",
    {
      element: "largeInput",
      placeholder: "File Text Content",
      storeAs: "content",
      name: "Content",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (data) => {
    return `Path: ${data.path} - Content: ${data.content}`;
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let fs = bridge.fs;

    fs.writeFileSync(bridge.transf(values.path), bridge.transf(values.content));
  },
};
