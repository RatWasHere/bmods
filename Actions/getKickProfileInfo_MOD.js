/*
With this mod, you can take information about the Profile on Kick

npm i streamer.info
*/
module.exports = {
  modules: ["streamer.info"],
  data: {
    name: "Get Kick Profile Info",
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
          data: { kickstreaminformations: "Search status" },
          UI: [
            {
              element: "dropdown",
              storeAs: "kickstreaminformations",
              name: "Get Kick Profile Information",
              choices: [
                { name: "Search status" },
                { name: "Bio" },
                { name: "Url avatar" },
                { name: "Verified" },
                { name: "Instagram (Name)" },
                { name: "Instagram (Link)" },
                { name: "X (Name)" },
                { name: "X (Link)" },
                { name: "YouTube (Name)" },
                { name: "YouTube (Link)" },
                { name: "Discord (Name)" },
                { name: "TikTok (Name)" },
                { name: "TikTok (Link)" },
                { name: "Facebook (Name)" },
                { name: "Facebook (Link)" }
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
    const info = await kick.getStreamerProfile(username);

    bridge.store(values.erorrstore, info.error);

    for (const infoCase of values.cases) {
      if (infoCase.type !== "informations") continue;

      let output;
      switch (infoCase.data.kickstreaminformations) {
        case "Search status":
          output = info.success;
          break;
        case "Bio":
          output = info?.bio;
          break;
        case "Url avatar":
          output = info?.avatar;
          break;
        case "Verified":
          output = info?.verified;
          break;
        case "Instagram (Name)":
          output = info?.socials?.instagram?.row;
          break;
        case "Instagram (Link)":
          output = info?.socials?.instagram?.link;
          break;
        case "X (Name)":
          output = info?.socials?.x?.row;
          break;
        case "X (Link)":
          output = info?.socials?.x?.link;
          break;
        case "YouTube (Name)":
          output = info?.socials?.youtube?.row;
          break;
        case "YouTube (Link)":
          output = info?.socials?.youtube?.link;
          break;
        case "Discord (Name)":
          output = info?.socials?.discord?.row;
          break;
        case "TikTok (Name)":
          output = info?.socials?.tiktok?.row;
          break;
        case "TikTok (Link)":
          output = info?.socials?.tiktok?.link;
          break;
        case "Facebook (Name)":
          output = info?.socials?.facebook?.row;
          break;
        case "Facebook (Link)":
          output = info?.socials?.facebook?.link;
          break;
        }

      bridge.store(infoCase.data.store, output);
    }
  },
};
