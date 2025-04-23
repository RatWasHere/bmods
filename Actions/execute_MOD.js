modVersion = "s.v1.1 | AceFix";
module.exports = {
  data: {
    name: "Execute",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "largeInput",
      storeAs: "command",
      name: "Command",
      max: 5000000,
    },
    "-",
    {
      element: "storage",
      storeAs: "result",
      name: "Store Result As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],
  category: "Control",
  subtitle: (values, constants) => {
    return `Store Result As: ${constants.variable(values.result)}`;
  },

  async run(values, command, client, bridge) {
    await client.getMods().require("child_process");
    await new Promise((res, rej) => {
      let toExec = String.raw`${bridge.transf(values.command)}`;
      require("child_process").exec(toExec, (error, stdout, stderr) => {
        if (error) {
          bridge.store(values.result, `Error: ${error.message}`);
          return res();
        }
        if (stderr) {
          bridge.store(values.result, `Stderr: ${stderr}`);
          return res();
        }
        bridge.store(values.result, stdout);
        res();
      });
    });
  },
};
