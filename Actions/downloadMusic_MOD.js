// requires the yt-dlp binary for whichever platform is it that you use.

const { readFileSync } = require("fs")

module.exports ={
  data: {
    name: "Download Music File",
    //ytdlp: "https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files"
  },
  aliases: ["Download YouTube Audio", "Download Audio"],
  modules: ["fs", "node:child_process"],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Utilities",
  UI: [
    {
      element: "input",
      storeAs: "sourceLink",
      name: "Audio Source Link",
    },
    {
      element: "typedDropdown",
      storeAs: "format",
      name: "Audio Format",
      choices: {
        mp3: {name: "mp3"},
        flac: {name: "flac"},
        others: {name: "Other", field: true}
      }
    },
    {
      element: "input",
      storeAs: "outputFolder",
      name: "Storage Path",
    },
    {
      element: "text",
      text: `<div style="text-align=left">Seprate Path With ":", To Store It In A Folder Named "Music", Just Put Path As "Music"</div>`
    },
    "-",
    {
      element: "store",
      storeAs: "finalName",
      name: "Store Final File Name As",
    },
    {
      element: "store",
      storeAs: "finalSource",
      name: "Store Final Path As"
    },
    {
      element: "store",
      storeAs: "finalFile",
      name: "Store Final File As"
    },
    {
      element: "toggle",
      storeAs: "delete",
      name: "Delete File After (May Be Buggy)",
    },
    "-",
    {
      element: "text",
      text: `<div style="text-align=left">
      Requires the yt-dlp binary to be present in the same folder as bot.js file!<br>
      May require python 3.09+ to be installed!
      <button style="width: fit-content;" onclick="require('electron').shell.openExternal('https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files')"><btext>Download yt-dlp</btext></button>
      <button style="width: fit-content;" onclick="require('electron').shell.openExternal('https://www.python.org/downloads/')"><btext>Download python</btext></button> 
      </div>`
    },
    {
      element: "toggle",
      storeAs: "logging",
      name: "Print Debug Statements"
    }
  ],

  subtitle: (values) => {
    if (values.format.type == "others"){
      return `Download ${values.sourceLink} In ${values.format.value}, Saved To ${values.outputFolder}`
    }
    else{
      return `Download ${values.sourceLink} In ${values.format.type}, Saved To ${values.outputFolder}`
    }
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){
    // yt-dlp -x --audio-format <format> --windows-filenames -o %(title)s -P <outputPath> --restrict-filenames <url>
    let format = bridge.transf(values.format.type)
    let folderPath = bridge.transf(values.outputFolder)
    let url = bridge.transf(values.sourceLink)

    if (format == "others"){
      format = bridge.transf(values.format.value)
    }

    await new Promise((res, rej)=>{
      let command = `yt-dlp -x --audio-format <format> --windows-filenames -o %(title)s -P <outputPath> --restrict-filenames <url>`
      command = command.replace("<format>", format)
      command = command.replace("<outputPath>", folderPath)
      fcommand = command.replace("<url>", url)

      require("child_process").exec(fcommand, (error, stdout) =>{
        if (values.logging==true){
          console.log(stdout)
          console.log(error)
        }
        if (stdout.includes("[ExtractAudio] Destination:") && stdout.includes("[download] 100%")){
          let match = stdout.match(/Destination:\s+(.+)/)
          if (match){
            let filePath = match[1].trim()
            let fileName = filePath.match(/[\\/][^\\/]+$/)?.[0]?.substring(1) || "UnknownFileName"
            let fileSource = filePath.replace("\\", "\\\\")+"."+format
            let file = bridge.fs.readFileSync(fileSource)
            if (values.logging==true){
              console.log(fileName)
              console.log(fileSource)
            }
            bridge.store(values.finalSource, fileSource)
            bridge.store(values.finalFile, file)
            bridge.store(values.finalName, fileName.replaceAll("_"," "))
            if (values.delete == true){
              const platform = process.platform
              let deleteCommand
              if (platform === "win32") deleteCommand=`del /f /q "${fileSource}"`;
              else if (platform === "linux") deleteCommand=`rm -rf "${fileSource}"`;
              require("child_process").exec(deleteCommand, (error, stdout, stderr)=>{
                if (values.logging==true){
                  console.log(error)
                  console.log(stdout)
                  console.log(stderr)
                }
              })
            }
            return res()
          }
        }
        else if(stdout.includes("has already been downloaded") && stdout.includes("[ExtractAudio] Not converting audio")){
          bridge.store(values.finalSource, "File Already Exists")
          bridge.store(values.file, "File Already Exists")
          bridge.store(values.finalName, "File Already Exists")
          return res()
        }
        else if (error){
          bridge.store(values.finalSource, error.message)
          bridge.store(values.finalFile, error.message)
          bridge.store(values.finalName, error.message)
          return res()
        }
        else{
          bridge.store(values.finalSource, "Something went wrong...")
          bridge.store(values.file, "Something went wrong...")
          bridge.store(values.finalName, "Something went wrong...")
          return res()
        }
      })
    })
  }
}