modVersion = "v1.0.0";

module.exports = {
  name: "Data Path Changed (Custom Data)",
  nameSchemes: [
    "Store Path As (String)", 
    "Store Value As (String or object)", 
    "Store Old Value As (String or object)", 
    "Store Change Type As (String)"
  ],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "The event that is triggered when the json files are modified using Custom Data!",
  },

  initialize(client, data, run) {
    client.emitDataChange = (path, value, oldValue, changeType) => {
      run(
        [path, value, oldValue, changeType],
        path, value, oldValue, changeType
      );
    };
  },
};