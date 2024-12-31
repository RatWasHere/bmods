// requires the yt-dlp binary for whichever platform is it that you use.

const { readFileSync } = require("fs")

module.exports ={
  data: {
    name: "Download Music File",
    //ytdlp: "https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files"
  },
  aliases: ["Download YouTube Audio", "Download Audio"],
  modules: ["fs", "path", "node:child_process"],
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
    "-",
    {
      element: "dropdown",
      storeAs: "advancedMode",
      name: "Advanced Settings",
      choices:[
        {name: "No"},
        {name: "Yes"},
      ],
    },
    {
      element: "dropdown",
      storeAs: "useBrowserCookies",
      name: "Use Browser Cookies",
      choices: [{name: "No"}, {name: "Yes"}],
    },
    {
      element: "input",
      storeAs: "browserCookiesInfo",
      name: "Browser Cookie Details",
      placeholder: "BROWSER[+KEYRING][:PROFILE][::CONTAINER]"
    },
    {
      element: "dropdown",
      storeAs: "useCustomName",
      name: "Use Custom File Name",
      choices: [{name: "No"}, {name: "Yes"}],
    },
    {
      element: "input",
      storeAs: "customName",
      name: "Custom Name Format",
      placeholder: "https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#output-template",
    },
    {
      element: "dropdown",
      storeAs: "useArguments",
      name: "Add Other Arguments (Only Real Advanced Users)",
      choices: [{name: "No"}, {name: "Yes"}],
    },
    {
      element: "input",
      storeAs: "arguments",
      name: "Arguments",
      placeholder: "https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#usage-and-options",
    },
    "-",
    {
      element: "toggle",
      storeAs: "logging",
      name: "Print Debug Statements"
    }
  ],

  script: (values) =>{
    function refElm(skipAnimation){
      let config = values.data.advancedMode
      let uBC = values.data.useBrowserCookies
      let uCM = values.data.useCustomName
      let uA = values.data.useArguments

      if (config == "No") {
        values.UI[13].element = ""
        values.UI[14].element = ""
        values.UI[15].element = ""
        values.UI[16].element = ""
        values.UI[17].element = ""
        values.UI[18].element = ""
        values.UI[19].element = ""
      }

      if (config == "Yes"){
        values.UI[13].element = "dropdown"
        values.UI[15].element = "dropdown"
        values.UI[17].element = "dropdown"
        values.UI[19].element = "-"
      }

      if (config == "Yes" && uBC == "Yes"){
        values.UI[14].element = "input"
      } else {values.UI[14].element = ""}

      if (config == "Yes" && uCM == "Yes"){
        values.UI[16].element = "input"
      } else {values.UI[16].element = ""}

      if (config == "Yes" && uA == "Yes"){
        values.UI[18].element = "input"
      } else {values.UI[18].element = ""}
      
      setTimeout(()=>{
        values.updateUI()
      }, skipAnimation?1: values.commonAnimation*100)
    }

    refElm(true)

    values.events.on("change", ()=> {
      refElm()
    })
  },

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
    const {existsSync} = require("fs")
    const path = require("path")
    const platform = process.platform


    if (platform == "win32"){
      let dependencies = ["yt-dlp.exe", "ffmpeg.exe", "ffprobe.exe", "ffplay.exe", "ffmpeg.dll"]
      let projectPath = "./"

      const missingFiles = dependencies.filter((file) => existsSync(path.join(projectPath, file)) == false)
      
      if (missingFiles.length > 0){
        console.log("The following required files are missing: ", missingFiles.join(", "))
        bridge.store(values.finalSource, "Missing Required Files...")
        bridge.store(values.finalFile, "Missing Required Files...")
        bridge.store(values.finalName, "Missing Required Files...")
        return
      }
    }

    // yt-dlp -x --audio-format <format> --windows-filenames -o %(title)s -P <outputPath> --restrict-filenames <url>
    let format = bridge.transf(values.format.type)
    let folderPath = bridge.transf(values.outputFolder)
    let url = bridge.transf(values.sourceLink)

    if (format == "others"){
      format = bridge.transf(values.format.value)
    }

    await new Promise((res, rej)=>{
      let command = `yt-dlp -x --audio-format <format> --windows-filenames -o %(title)s -P <outputPath> --restrict-filenames --cookies-from-browser BROWSER[+KEYRING][:PROFILE][::CONTAINER] <additionalArgs> <url>`

      command = command.replace("<format>", format)
      command = command.replace("<outputPath>", folderPath)
      if (bridge.transf(values.useCustomName) == "Yes" && bridge.transf(values.customName).length > 0){
        command = command.replace("%(title)s", bridge.transf(values.customName).replaceAll("|", "").replaceAll(" ","_"))
      }

      if (bridge.transf(values.useBrowserCookies) == "Yes" && bridge.transf(values.browserCookiesInfo).length > 0){
        command = command.replace("BROWSER[+KEYRING][:PROFILE][::CONTAINER]", bridge.transf(values.browserCookiesInfo).replaceAll("|",""))
      } else {
        command = command.replace("--cookies-from-browser BROWSER[+KEYRING][:PROFILE][::CONTAINER]", "")
      }

      if (bridge.transf(values.useArguments) == "Yes" && bridge.transf(values.arguments).length > 0){
        command = command.replace("<additionalArgs>", bridge.transf(values.arguments).replaceAll("|", ""))
      } else {
        command = command.replace("<additionalArgs>", "")
      }
      
      fcommand = command.replace("<url>", url)

      if (values.logging == true){
        console.log("Executing Command: ",fcommand)
      }

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
        else if(stdout.includes("Sign in to confirm your age.")){
          bridge.store(values.finalSource, "Explicit Content Detected")
          bridge.store(values.file, "Explicit Content Detected")
          bridge.store(values.finalName, "Explicit Content Detected")
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