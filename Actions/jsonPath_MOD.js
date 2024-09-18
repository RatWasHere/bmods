module.exports = {
  modules: ["jsonpath"],
  data: {
    name: "Json Path",
  },
  category: "Json",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://www.buymeacoffee.com/candiedapple"
  },
  UI: [
    {
      element: "variableInsertion",
      name: "Json (Must be json object)",
      storeAs: "json",
    },
    "-",
    {
      element: "input",
      name: `Json Path
            <div class="hoverablez" onclick="require('electron').shell.openExternal('https://goessner.net/articles/JsonPath/')" style="width: 20%; margin: left; padding-bottom: 12px; margin-bottom: -12px; border-radius: 8px;"><text style="margin-left:8px; padding: 3px;">Click for Guide</text></div>`,
      storeAs: "path",
      placeholder: "$.store.book[*].author",
    },
    "-",
    {
      element: "toggle",
      name: "Log to Console",
      storeAs: "logtoconsole",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
  ],
  async run(values, message, client, bridge) {
    const data = bridge.get(values.json);
    const jsonpath = require("jsonpath");
    const result = jsonpath.query(data, bridge.transf(values.path));
    if (values.logtoconsole) {
      console.log(result);
    }
    bridge.store(values.store, result);
  },
};
