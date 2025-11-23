modVersion = "v1.2.0"
module.exports = {
  data: {
    name: "Fetch Steam Profile Info",
  },
  aliases: ["Resolve Steam Id"],
  modules: [],
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
      placeholder: "https://steamcommunity.com/dev/apikey",
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
      name: "Store Steam Profile Summary As (JSON Object)",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) => {
    return `Fetch Steam Profile Summary Of ${values.steamProfileLink}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let steamApiKey = bridge.transf(values.steamApiKey)
    let steamProfileLink = bridge.transf(values.steamProfileLink)
    if (steamApiKey == "") {
      return console.error(`A Steam API Key Is Required!`)
    }

    const extractionRegex = /(?:https?:\/\/)?(?:steamcommunity\.com\/)?(id|profiles)\/([^/]+)/
    let match = steamProfileLink.match(extractionRegex)
    let identifier = match ? match[2] : steamProfileLink

    let steamId
    if (/^\d+$/.test(identifier) == true && identifier != undefined) {
      steamId = identifier
    } else if (/^\d+$/.test(identifier) == false && identifier != undefined) {
      let vanityQuery = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamApiKey}&vanityurl=${identifier}`.replaceAll(" ", "")
      const vanityResponse = await fetch(vanityQuery, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Other",
        },
      })
      if (!vanityResponse.ok || !vanityResponse.headers.get("content-type").includes(`application/json`)) {
        let vanityErrorText = await vanityResponse.text()
        console.error(`HTTP Error! ${vanityErrorText}`)
        steamId = undefined
      } else if (vanityResponse.headers.get("content-type").includes(`application/json`)) {
        const vanityData = await vanityResponse.json()
        if (vanityData.response.success == 1) {
          steamId = vanityData.response.steamid
        } else {
          console.error("Failed To Resolve Vanity To Steam ID")
          steamId = undefined
        }
      }
    } else {
      steamId = undefined
    }
    bridge.store(values.steamId, steamId)

    await new Promise((resolve) => setTimeout(resolve, 500))

    let profileObject
    if (steamId != undefined && values.profileSummary?.value !== "") {
      let summaryQuery = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamApiKey}&steamids=${steamId}`.replaceAll(" ", "")
      const summaryResponse = await fetch(summaryQuery, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Other",
        },
      })
      if (!summaryResponse.ok || !summaryResponse.headers.get("content-type").includes(`application/json`)) {
        let summaryErrorText = await summaryResponse.text()
        console.error(`HTTP Error! ${summaryErrorText}`)
        profileObject = undefined
      } else if (summaryResponse.headers.get("content-type").includes(`application/json`)) {
        const summary = await summaryResponse.json()
        if (summary.response.players.length > 0) {
          profileObject = summary.response.players[0]
        } else {
          console.error("Failed To Fetch Profile Information")
          profileObject = undefined
        }
      }
    } else {
      profileObject = undefined
    }
    bridge.store(values.profileSummary, profileObject)
  },
}
