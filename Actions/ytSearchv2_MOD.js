modVersion = "s.v1.5"
module.exports={
  data: {
    name: "YouTube Video Search v2"
  },
  modules: ["yt-search", "youtubei.js", "discordjs/voice"],
  category: "Music",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI:[
    {
      element: "input",
      storeAs: "searchFor",
      name: "Search For",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "resultNum",
      name: "Result #",
      choices: {
        first: {name: "First", field: false},
        custom: {name: "Custom #", field: true, placeholder: "Results Start At #0"},
      },
    },
    {
      element: "menu",
      storeAs: "infoList",
      name: "List Of Info",
      types: {info: "info"},
      max: 13,
      UItypes: {
        info: {
          data: {},
          name: "Info",
          preview: "`Store ${option.data.get} To Variable: ${option.data.store.type}('${option.data.store.value}')`",
          UI:[
            {
              element: "dropdown",
              storeAs: "get",
              name: "Info To Store",
              choices: [
                { name: "URL" },
                { name: "Title" },
                { name: "Track" },
                { name: "Tracks" },
                { name: "ID" },
                { name: "Thumbnail URL" },
                { name: "Upload Timestamp" },
                { name: "Description" },
                { name: "Duration (Seconds)" },
                { name: "Views" },
                { name: "Author Name" },
                { name: "Author URL" },
                { name: "Author Icon URL" },
              ]
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store As",
            }
          ]
        }
      }
    },
    {
      element: "condition",
      storeAs: "ifNone",
      storeActionsAs: "ifNoneActions",
      name: "If No Results"
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values) =>{
    return `Search For ${values.searchFor}, Get ${values.infoList.length} Infos`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    await client.getMods().require("yt-search")
    let search = require("yt-search")
    let result = await search(bridge.transf(values.searchFor))
    let position = 0
    let infoList = values.infoList

    if (values.resultNum.type === "custom"){
      position = parseInt(bridge.transf(values.resultNum.value))
    }

    if (!result.videos[0]){
      bridge.call(values.ifNone, values.ifNoneActions)
    }

    let video = result.videos[position]

    for (let info of infoList){
      let output
      switch(info.data.get){
        case "Track":
          await client.getMods().require("youtubei.js")
          await client.getMods().require("@discordjs/voice")
          const {Innertube} = require("youtubei.js")
          const {createAudioResource} = require("@discordjs/voice")
          const youtube = await Innertube.create().catch()
          const videoInfo = await youtube.getInfo(video.videoId)
          const format = videoInfo.chooseFormat({type: "audio", quality: "best"})
          const url = format?.decipher(youtube.session.player)
          const audio = createAudioResource(url)

          output = {
            name: video.title,
            author: video.author.name,
            url: video.url,
            src: "YouTube",
            audio: audio,
            file: null,
            raw: video,
          }
          break

        case "URL":
          output = video.url
          break

        case "Title":
          output = video.title
          break

        case "Author URL":
          output = video.author.url
          break

        case "Author Icon URL":
          let newSearch = await search(video.title + " by" + video.author.name + "(" + video.author.url + ")")
          output = newSearch.accounts[0].image
          break

        case "Author Name":
          output = video.author.name
          break

        case "Upload Timestamp":
          output = video.timestamp
          break

        case "Description":
          output = video.description
          break

        case "Thumbnail URL":
          output = video.thumbnail
          break

        case "Views":
          output = video.views
          break

        case "Duration (Seconds)":
          output = video.duration
          break

        case "ID":
          output = video.videoId
          break
      }

      bridge.store(info.data.store, output)
    }
  }
}