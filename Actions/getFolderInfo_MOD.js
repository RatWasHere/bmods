const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "Get Folder Info",
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
    "-",
    {
      element: "typedDropdown",
      storeAs: "infoType",
      name: "Get",
      choices: {
        fileList: { name: "File List" },
        folderList: { name: "Folder List" },
        size: { name: "Total Size (MB)" },
        realpath: { name: "Real Path" },
        name: { name: "Name" },
        isFile: { name: "Is File" },
        isDirectory: { name: "Is Directory" },
        atime: { name: "Access Time" },
        mtime: { name: "Modified Time" },
        ctime: { name: "Change Time" },
        birthtime: { name: "Birth Time" },
      },
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store",
    },
  ],

  subtitle: (values, constants, thisAction) => {
    return `${
      thisAction.UI.find((e) => e.element == "typedDropdown").choices[
        values.infoType.type
      ].name
    } of Folder: ${values.path} - Store As: ${constants.variable(
      values.store,
    )}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const folderPath = path.resolve(bridge.file(values.path) || "");
    let output;

    const infoType =
      typeof values.infoType === "object" && values.infoType !== null
        ? values.infoType.type
        : values.infoType;

    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const items = fs.readdirSync(folderPath);

      switch (infoType) {
        case "fileList":
          output = items
            .filter((item) => fs.statSync(path.join(folderPath, item)).isFile())
            .join(",");
          break;
        case "folderList":
          output = items
            .filter((item) =>
              fs.statSync(path.join(folderPath, item)).isDirectory(),
            )
            .join(",");
          break;
        case "size":
          output = items
            .filter((item) => fs.statSync(path.join(folderPath, item)).isFile())
            .reduce(
              (totalSize, file) =>
                totalSize + fs.statSync(path.join(folderPath, file)).size,
              0,
            );
          output = `${(output / (1024 * 1024)).toFixed(2)}`;
          break;
        case "realpath":
          output = fs.realpathSync(folderPath);
          break;
        case "name":
          output = path.basename(folderPath);
          break;
        case "isFile":
          output = fs.statSync(folderPath).isFile();
          break;
        case "isDirectory":
          output = fs.statSync(folderPath).isDirectory();
          break;
        case "atime":
          output = fs.statSync(folderPath).atime.getTime();
          break;
        case "mtime":
          output = fs.statSync(folderPath).mtime.getTime();
          break;
        case "ctime":
          output = fs.statSync(folderPath).ctime.getTime();
          break;
        case "birthtime":
          output = fs.statSync(folderPath).birthtime.getTime();
          break;
        default:
          output = "undefined";
          break;
      }
    } else {
      output = "Path is not a valid directory";
    }
    bridge.store(values.store, output);
  },
};
