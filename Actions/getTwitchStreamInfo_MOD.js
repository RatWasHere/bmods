/*
With this mod, you can take information about the stream on twitch

npm i streamer.info
*/
module.exports = {
  modules: ["streamer.info"],
  data: {
    name: "Get Twitch Stream Info",
  },
  category: "Media",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus"
  },
  UI: [
    {
      element: "input",
      name: "Username",
      storeAs: "username"
    },
    "-",
    {
      element: "store",
      storeAs: "erorrstore",
      name: "Store As error"
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "Informations",
      types: {
        informations: "Informations"
      },
      max: 200,
      UItypes: {
        informations: {
          name: "Stream Information",
          preview: '`Selected: ${option.data.twitchstreaminformations}`',
          data: { twitchstreaminformations: "Status live" },
          UI: [
            {
              element: "dropdown",
              storeAs: "twitchstreaminformations",
              name: "Get Twitch Stream Information",
              choices: [
                { name: "Status live" },
                { name: "Name" },
                { name: "Title" },
                { name: "Url Avatar" },
                { name: "Url Thumbnail" },
                { name: "Url Stream" },
                { name: "Url Stream (Full Screen)" },
                { name: "The start time of the stream (timestamp)" }
              ],
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store As"
            }
          ]
        }
      }
    }
  ],

  subtitle: (data, constants) => {
    return `${data.username}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const username = bridge.transf(values.username);
    const { Twitch } = require("streamer.info");

    const twitch = new Twitch();
    const info = await twitch.getStream(username);

    bridge.store(values.erorrstore, info.error);

    for (const infoCase of values.cases) {
      if (infoCase.type !== "informations") continue;

      let output;
      switch (infoCase.data.twitchstreaminformations) {
        case "Status live":
          output = info.live;
          break;
        case "Name":
          output = info?.name;
          break;
        case "Title":
          output = info?.title;
          break;
        case "Url Avatar":
          output = info?.avatar;
          break;
        case "Url Thumbnail":
          output = info?.thumbnail?.bestResolution;
          break;
        case "Url Stream":
          output = info?.urls?.stream;
          break;
        case "Url Stream (Full Screen)":
          output = info?.urls?.fullScreen;
          break;
        case "The start time of the stream (timestamp)":
          output = info?.start?.timestamp?.row;
          break;
        }

      bridge.store(infoCase.data.store, output);
    }
  },
};
