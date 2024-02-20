module.exports = {
    data: {
      name: "waifu.pics Random Image",
    },
    category: "Images",
    UI: [
      {
        element: "dropdown",
        storeAs: "category",
        name: "Category",
        choices: [
          { name: "NSFW-waifu" },
          { name: "NSFW-neko" },
          { name: "NSFW-trap" },
          { name: "NSFW-blowjob" },
          { name: "SFW-waifu" },
          { name: "SFW-neko" },
          { name: "SFW-shinobu" },
          { name: "SFW-megumin" },
          { name: "SFW-bully" },
          { name: "SFW-cuddle" },
          { name: "SFW-cry" },
          { name: "SFW-hug" },
          { name: "SFW-awoo" },
          { name: "SFW-kiss" },
          { name: "SFW-lick" },
          { name: "SFW-pat" },
          { name: "SFW-smug" },
          { name: "SFW-bonk" },
          { name: "SFW-yeet" },
          { name: "SFW-blush" },
          { name: "SFW-smile" },
          { name: "SFW-wave" },
          { name: "SFW-highfive" },
          { name: "SFW-nom" },
          { name: "SFW-bite" },
          { name: "SFW-glomp" },
          { name: "SFW-slap" },
          { name: "SFW-kill" },
          { name: "SFW-happy" },
          { name: "SFW-wink" },
          { name: "SFW-poke" },
          { name: "SFW-dance" },
          { name: "SFW-cringe" }
        ]
      },
      {
        element: "storageInput",
        storeAs: "store",
        name: "Store Image URL As"
      },
    ],
  
    async run(values, interaction, client, bridge) {
  
      let api
  
      switch (values.category) {
        case "NSFW-waifu":
          api = "https://api.waifu.pics/nsfw/waifu"
          break;
        case "NSFW-neko":
          api = "https://api.waifu.pics/nsfw/neko"
          break;
        case "NSFW-trap":
          api = "https://api.waifu.pics/nsfw/trap"
          break;
        case "NSFW-blowjob":
          api = "https://api.waifu.pics/nsfw/blowjob"
          break;
        case "SFW-waifu":
          api = "https://api.waifu.pics/sfw/waifu"
          break;
        case "SFW-neko":
          api = "https://api.waifu.pics/sfw/neko"
          break;
        case "SFW-shinobu":
          api = "https://api.waifu.pics/sfw/shinobu"
          break;
        case "SFW-megumin":
          api = "https://api.waifu.pics/sfw/megumin"
          break;
        case "SFW-bully":
          api = "https://api.waifu.pics/sfw/bully"
          break;
        case "SFW-cuddle":
          api = "https://api.waifu.pics/sfw/cuddle"
          break;
        case "SFW-cry":
          api = "https://api.waifu.pics/sfw/cry"
          break;
        case "SFW-hug":
          api = "https://api.waifu.pics/sfw/hug"
          break;
        case "SFW-awoo":
          api = "https://api.waifu.pics/sfw/awoo"
          break;
        case "SFW-kiss":
          api = "https://api.waifu.pics/sfw/kiss"
          break;
        case "SFW-lick":
          api = "https://api.waifu.pics/sfw/lick"
          break;
        case "SFW-pat":
          api = "https://api.waifu.pics/sfw/pat"
          break;
        case "SFW-smug":
          api = "https://api.waifu.pics/sfw/smug"
          break;
        case "SFW-bonk":
          api = "https://api.waifu.pics/sfw/bonk"
          break;
        case "SFW-yeet":
          api = "https://api.waifu.pics/sfw/yeet"
          break;
        case "SFW-blush":
          api = "https://api.waifu.pics/sfw/blush"
          break;
        case "SFW-smile":
          api = "https://api.waifu.pics/sfw/smile"
          break;
        case "SFW-wave":
          api = "https://api.waifu.pics/sfw/wave"
          break;
        case "SFW-highfive":
          api = "https://api.waifu.pics/sfw/highfive"
          break;
        case "SFW-nom":
          api = "https://api.waifu.pics/sfw/nom"
          break;
        case "SFW-bite":
          api = "https://api.waifu.pics/sfw/bite"
          break;
        case "SFW-glomp":
          api = "https://api.waifu.pics/sfw/glomp"
          break;
        case "SFW-slap":
          api = "https://api.waifu.pics/sfw/slap"
          break;
        case "SFW-kill":
          api = "https://api.waifu.pics/sfw/kill"
          break;
        case "SFW-happy":
          api = "https://api.waifu.pics/sfw/happy"
          break;
        case "SFW-wink":
          api = "https://api.waifu.pics/sfw/wink"
          break;
        case "SFW-poke":
          api = "https://api.waifu.pics/sfw/poke"
          break;
        case "SFW-dance":
          api = "https://api.waifu.pics/sfw/dance"
          break;
        case "SFW-cringe":
          api = "https://api.waifu.pics/sfw/cringe"
          break;
      }
  
      await fetch(api).then(
        async (response) => {
          let res = await response.json();
          bridge.store(values.store, res.url);
        }
      );
    },
  };
  