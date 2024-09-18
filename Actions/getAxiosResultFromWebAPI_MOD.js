module.exports = {
  modules: ["axios", "jsonpath"],
  data: {
    name: "Get Axios Result From WebAPI",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://www.buymeacoffee.com/candiedapple"
  },
  category: "WebAPIs",
  UI: [
    {
      element: "input",
      name: "WebAPI URL",
      storeAs: "url",
    },
    "-",
    {
      element: "largeInput",
      name: "Headers (Make sure the format is correct)",
      placeholder: "{ \n'User-Agent': 'Other', \n'Key': 'Value' \n}",
      storeAs: "headers",
    },
    "-",
    {
      element: "input",
      name: "Path",
      storeAs: "pathtores",
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
      name: "Store Result Object As",
      storeAs: "store",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result Status As",
      storeAs: "storestatus",
    },
    "-",
    {
      text: "The mod is in a ugly state, please report any issues to the creator - candiedapple",
    },
  ],
  subtitle: "Store JSON: $[url]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const url = bridge.transf(values.url);
    const headers = JSON.parse(bridge.transf(values.headers));
    const jsonpath = require('jsonpath');
    const axios = require('axios');

    return new Promise((resolve, reject) => {
      axios.get(url, { headers })
        .then(response => {
          if (response.status === 200) {
            const data = response.data;
            const path = bridge.transf(values.pathtores);

            if (path) {
              // Ensure the path is correctly formatted for jsonpath
              const formattedPath = path.replace(/\.\[/g, '[');
              const result = jsonpath.query(data, formattedPath);

              if (result.length > 0) {
                if (values.logtoconsole) {
                  console.log(result);
                }
                bridge.store(values.store, result);
                resolve(data);
              } else {
                reject(new Error(`Path "${path}" not found in response data`));
              }
            } else {
              reject(new Error('Path to result is not defined'));
            }
          } else {
            reject(new Error(`Error: ${response.status}`));
          }
        })
        .catch(error => {
          console.error(`Error: ${error.response ? error.response.status : error.message}`);
          reject(error);
        });
    });
  },
};