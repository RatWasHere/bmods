/*
    Run Js File mod by LikRus
    Licensed under MIT License

    Using this action, you can play the code from the files.
*/
modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Run Js File",
  },
  modules: ["node:path"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    description: "Using this action, you can play the code from the files.",
    donate: "https://boosty.to/cactus/donate",
  },
  category: "Control",
  UI: [
    {
      element: "input",
      storeAs: "file",
      name: "File JS",
      placeholder: "path/to/script.js"
    },
    "_",
    {
      element: "toggle",
      storeAs: "console",
      name: "Output the error to the console?",
      true: "Yes!",
      false: "Nono!"
    },
    "-",
    {
      element: "storage",
      storeAs: "store",
      name: "Store result As",
      help: {
        title: "Store result As?",
        UI: [
          {
            element: "text",
            text: "What is transmitted to the result?",
            header: true,
          },
          {
            element: "text",
            text: `In Json format from the code for example:`
          },
          {
            element: "text",
            text: `module.exports = {`,
          },
          {
            element: "text",
            text: `user,`,
          },
          {
            element: "text",
            text: `version,`,
          },
          {
            element: "text",
            text: `items,`,
          },
          {
            element: "text",
            text: `isActive`,
          },
          {
            element: "text",
            text: `};`,
          },
        ],
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants) => {
    return `Run the code from the file: ${values.file} - Store result As: ${constants.variable(values.store)}`;
  },

  async run(values, interaction, client, bridge) {
      for (const moduleName of this.modules) {
          await client.getMods().require(moduleName)
      }
      
      const path = require("node:path")
      
      let destination = path.normalize(bridge.transf(values.file))
      
      const botData = require("../data.json")
      const workingDir = path.normalize(process.cwd())
      let projectFolder
      if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
          projectFolder = botData.prjSrc
      } else {
          projectFolder = workingDir
      }
      
      let fullPath = path.join(path.normalize(projectFolder), destination)
      
      function runAndGet(filePath) {
          try {
              const resolved = require.resolve(filePath);
              delete require.cache[resolved];
              
              return require(filePath);
          } catch (error) {
              if (values.console) {
                  console.error(error);
              }
              return null;
          }
      }
      
      const data = runAndGet(fullPath);
      
      if (data !== null && data !== undefined) {
          bridge.store(values.store, data);
      }
      
  },
};
