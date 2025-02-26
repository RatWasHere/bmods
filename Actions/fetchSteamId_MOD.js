modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Fetch Steam Profile Info",
  },
  aliases: ["Resolve Steam Id"],
  modules: ["node-fetch"],
  category: "WebAPIs",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "steamApiKey",
      name: "Steam API Key",
      placeholder: "https://steamcommunity.com/dev/apikey"
    },
    {
      element: "input",
      storeAs: "steamProfileLink",
      name: "Steam Profile Link",
    },
    "-",
    {
      element: "store",
      storeAs: "steamId",
      name: "Store Steam ID As",
    },
    {
      element: "store",
      storeAs: "profileSummary",
      name: "Store Steam Profile Summary As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) =>{
    return `Fetch Steam Profile Summary Of ${values.steamProfileLink}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    this.modules.forEach(moduleName =>{
      await client.getMods().require(moduleName)
    })
    let steamApiKey = bridge.transf(values.steamApiKey)
    let steamProfileLink = bridge.transf(values.steamProfileLink)

    const extractionRegex = /(?:https?:\/\/)?(?:steamcommunity\.com\/)?(id|profiles)\/([^/]+)/
    let match = steamProfileLink.match(extractionRegex)
    let identifier = match ? match[2] : steamProfileLink

    let steamId
    if (/^\d+$/.test(identifier) == true && identifier != undefined){
      steamId = identifier
    } else if (/^\d+$/.test(identifier) == false && identifier != undefined){
      const vanityQuery = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamApiKey}&vanityurl=${identifier}`)
      const vanityResponse = await vanityQuery.json()
        if (vanityResponse.response.success == 1) {
            steamId = vanityResponse.response.steamid; // Resolved Steam ID
        } else {
            console.error("Failed To Resolve Vanity To Steam ID");
            steamId = undefined
        }
    } else {steamId = undefined}
    bridge.store(values.steamId, steamId)

    let profileObject
    if (steamId != undefined && values.profileSummary){
      const profileObjectQuery = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamApiKey}&steamids=${steamId}`)
      const profileObjectResponse = await profileObjectQuery.json()
      if (profileObjectResponse.response.players.length > 0) {
        profileObject = profileObjectResponse.response.players[0]
      } else {
        console.error("Failed To Fetch Profile Information")
        profileObject = undefined
      }
    } else {profileObject = undefined}
    bridge.store(values.profileSummary, profileObject)
  }
}