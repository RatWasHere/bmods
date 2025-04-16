modVersion = "s.v1.0";
module.exports = {
  data: {
    name: "wget Download",
  },
  aliases: ["Download File"],
  modules: ["wget-improved", "fs", "path"],
  category: "",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "dlLink",
      name: "Resource URL",
    },
    {
      element: "input",
      storeAs: "filePath",
      name: "File Path",
      placeholder: "example/file.xyz",
    },
    {
      element: "store",
      storeAs: "fileSize",
      name: "Store File Size As",
    },
    {
      element: "store",
      storeAs: "fileBuffer",
      name: "Store File As",
    },
    "-",
    {
      element: "toggle",
      storeAs: "deleteAfter",
      name: "Delete File?",
    },
    "-",
    {
      element: "condition",
      storeAs: "onError",
      storeActionsAs: "onErrorActions",
      name: "On Error",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Download ${values.dlLink || "Nothing"} To ${
      values.filePath || "The Void"
    }`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName);
    }

    const wget = require("wget-improved");
    const fs = require("fs");
    const path = require("path");
    const options = {};
    let dlLink = bridge.transf(values.dlLink);
    let filePath = path.normalize(bridge.transf(values.filePath) || "./");
    let fileDir = path.dirname(filePath);
    if (fs.existsSync(fileDir) == false) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      let download = wget.download(dlLink, filePath, options);

      download.on("error", function (err) {
        console.log(err);
        bridge.call(values.onError, values.onErrorActions);
        return resolve(err);
      });

      download.on("start", function (fileSize) {});

      download.on("end", function (output) {
        console.log(`File Download From ${dlLink} Completed, ${output}`);
        let fileSize = fs.statSync(`./${filePath}`).size;
        if (values.fileBuffer) {
          fileRead = bridge.fs.readFileSync(`./${filePath}`);
          bridge.store(values.fileBuffer, fileRead);
        }
        bridge.store(values.fileSize, fileSize);
        return resolve();
      });
    });

    if (values.deleteAfter == true) {
      fs.unlinkSync(`./${filePath}`);
    }
  },
};
