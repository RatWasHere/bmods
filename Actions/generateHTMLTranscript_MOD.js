module.exports = {
  data: {
    name: "Generate HTML Transcript",
  },
  modules: ["oceanic-transcripts"],
  category: "WebAPIs",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "TheMonDon",
  },
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true,
    },
    "-",
    {
      element: "dropdown",
      name: "Save Images",
      storeAs: "saveImages",
      choices: [
        {
          name: "False",
        },
        {
          name: "True",
        },
      ],
    },
    {
      element: "dropdown",
      name: "Show Footer",
      storeAs: "showFooter",
      choices: [
        {
          name: "True",
        },
        {
          name: "False",
        },
      ],
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
    },
  ],

  async run(values, interaction, client, bridge) {
    const discordTranscripts = require("oceanic-transcripts");
    const saveImages = bridge.transf(values.saveImages).toLowerCase();
    const poweredBy = bridge.transf(values.showFooter).toLowerCase();
    const channel = await bridge.getChannel(values.channel);

    const attachment = await discordTranscripts.createTranscript(channel, {
      returnType: "buffer",
      saveImages,
      poweredBy,
    });

    await Promise.all([attachment]).then((results) => {
      bridge.store(values.store, results[0]);
    });
  },
};
