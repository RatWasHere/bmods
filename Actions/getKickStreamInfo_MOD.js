/*
With this mod, you can take information about the stream on Kick

npm i streamer.info
*/
module.exports = {
  modules: ["streamer.info"],
  data: {
    name: "Get Kick Stream Info",
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
          preview: '`Selected: ${option.data.kickstreaminformations}`',
          data: { kickstreaminformations: "Status live" },
          UI: [
            {
              element: "dropdown",
              storeAs: "kickstreaminformations",
              name: "Get Kick Stream Information",
              choices: [
                { name: "Status live" },
                { name: "ID live" },
                { name: "Title" },
                { name: "language" },
                { name: "Viewers" },
                { name: "Category (Id)" },
                { name: "Category (Name)" },
                { name: "Category (Tags)" },
                { name: "Url Thumbnail" },
                { name: "Url Stream" },
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
    const { Kick } = require("streamer.info");

    const kick = new Kick();
    const info = await kick.getStream(username);

    bridge.store(values.erorrstore, info.error);

    for (const infoCase of values.cases) {
      if (infoCase.type !== "informations") continue;

      let output;
      switch (infoCase.data.kickstreaminformations) {
        case "Status live":
          output = info.live;
          break;
        case "Name":
          output = info?.id;
          break;
        case "Title":
          output = info?.title;
          break;
        case "language":
          output = info?.language;
          break;
        case "Viewers":
          output = info?.viewers;
          break;
        case "Category (Id)":
          output = info?.category?.id;
          break;
        case "Category (Name)":
          output = info?.category?.name;
          break;
        case "Category (Tags)":
          output = info?.category?.tags;
          break;
        case "Url Thumbnail":
          output = info?.thumbnail;
          break;
        case "Url Stream":
          output = info?.urls?.stream;
          break;
        case "The start time of the stream (timestamp)":
          output = info?.start?.timestamp?.row;
          break;
        }

      bridge.store(infoCase.data.store, output);
    }
  },
};
