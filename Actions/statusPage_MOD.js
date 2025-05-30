modVersion = "s.v2.0"
module.exports = {
  data: {
    name: "Create Status Page",
    host: "localhost",
    port: "3000",
    graphHistoryCount: 60,
    consoleHistoryCount: 1000,
    interval: 2.5
  },
  aliases: [],
  modules: ["node:http", "node:os", "node:fs", "node:path", "node:url", "node:https"],
  category: "Utilities",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia & qizzle",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "host",
      name: "Host",
      placeholder: "0.0.0.0 (Available On Local Network)"
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port"
    },
    {
      element: "input",
      storeAs: "password",
      name: "Login Password (Optional)"
    },
    "-",
    {
      element: "input",
      storeAs: "graphHistoryCount",
      name: "Graph History Count",
      placeholder: 60
    },
    {
      element: "input",
      storeAs: "consoleHistoryCount",
      name: "Console History Count",
      placeholder: 1000
    },
    {
      element: "input",
      storeAs: "interval",
      name: "Update Interval (In Seconds)",
      placeholder: 5
    },
    "-",
    {
      element: "menu",
      storeAs: "replacements",
      name: "HTML Content Replacements",
      types: {
        replacements: "replacements",
      },
      max: 99999,
      UItypes: {
        replacements:{
          data: {},
          name: "Replace",
          preview: "`${option.data.findText} with ${option.data.replaceText}`",
          UI: [
            {
              element: "input",
              storeAs: "findText",
              name: "Find Text",
            },
            {
              element: "input",
              storeAs: "replaceText",
              name: "Replacement Text",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Create Status Page View On ${values.host}:${values.port}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const http = require("node:http")
    const https = require("node:https")
    const os = require("node:os")
    const path = require("node:path")
    const fs = require("node:fs")
    const oceanic = require("oceanic.js")

    const host = bridge.transf(values.host) || "0.0.0.0"
    const port = parseInt(bridge.transf(values.port), 10) || 3000
    const password = bridge.transf(values.password) || "password"
    const graphHistoryCount = parseInt(bridge.transf(values.graphHistoryCount)) || 60
    const logsHistoryCount = parseInt(bridge.transf(values.consoleHistoryCount)) || 100
    const interval = parseFloat(bridge.transf(values.interval))*1000 || 5000

    const botData = require("../data.json")
    const appName = botData.name || "NodeJS"
    const workingDir = path.normalize(process.cwd())
    const botStartTimestamp = new Date()

    let workingPath
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
      workingPath = botData.prjSrc
    } else {
      workingPath = workingDir
    }

    let htmlFilePath = path.join(workingPath, "statusPage", "index.html")
    let icoFilePath = path.join(workingPath, "statusPage", "bmd.ico")
    let statusPageDir = path.dirname(htmlFilePath)
    if (!fs.existsSync(statusPageDir)){
      fs.mkdirSync(statusPageDir, { recursive: true })
    }

    // Getting Files From GitHub If They Dont Exist
    const siteFiles = {
      html: {github: `https://raw.githubusercontent.com/slothyace/bmods-acedia/refs/heads/main/.assets/statusPage/index.html`, path: htmlFilePath, name: `index.html`},
      ico: {github: `https://raw.githubusercontent.com/slothyace/bmods-acedia/refs/heads/main/.assets/statusPage/bmd.ico`, path: icoFilePath, name: `bmd.ico`}
    }
    for (let coreKey in siteFiles) {
      const file = siteFiles[coreKey]

      if (!fs.existsSync(file.path)) {
        console.log(`Missing "${file.name}" in ${statusPageDir}, downloading from GitHub.`)

        try {
          await new Promise((resolve, reject) => {
            https.get(file.github, (response) => {
              if (response.statusCode !== 200) {
                reject(new Error(`Failed to download "${file.name}" from GitHub. Status Code: ${response.statusCode}`))
                return
              }

              const chunks = []

              response.on("data", (chunk) => chunks.push(chunk))

              response.on("end", () => {
                try {
                  const data = Buffer.concat(chunks)
                  fs.writeFileSync(file.path, data) // No encoding specified so it works for binary too
                  console.log(`"${file.name}" downloaded from GitHub.`)
                  resolve()
                } catch (err) {
                  reject(err)
                }
              })
            }).on("error", (err) => {
              reject(err)
            })
          })
        } catch (err) {
          console.error(`Error while downloading "${file.name}" from GitHub:`, err)
        }
      }
    }

    // Cpu Usage
    let lastCpuUsage = process.cpuUsage()
    let lastCpuTime = process.hrtime()
    function getProcessCpuPercent(){
      const currentCpu = process.cpuUsage(lastCpuUsage)
      const currentTime = process.hrtime(lastCpuTime)
      lastCpuUsage = process.cpuUsage()
      lastCpuTime = process.hrtime()
      const elapsedMicroSeconds = (currentTime[0]*1e6)+(currentTime[1]/1000)
      const totalCpuUsage = currentCpu.user + currentCpu.system
      return ((totalCpuUsage/elapsedMicroSeconds)*100).toFixed(2)
    }

    // Ram Usage
    function getProcessRamMb(){
      return (process.memoryUsage().heapUsed/(1024*1024)).toFixed(2)
    }

    let slashCommands = []
    let textCommands = []
    let msgCommands = []
    let userCommands = []
    let events = []
    let msgContentCommands = []
    let anyMessageCommands = []
    const commands = botData.commands
    commands.forEach(command =>{
      switch (command.trigger){
        case "slashCommand":
          slashCommands.push(command.customId)
          break

        case "textCommand":
          textCommands.push(command.customId)
          break

        case "event":
          events.push(command.customId)
          break
        
        case "message":
          msgCommands.push(command.customId)
          break

        case "user":
          userCommands.push(command.customId)
          break

        case "msgContent":
          msgContentCommands.push(command.customId)
          break

        case "anyMessage":
          anyMessageCommands.push(command.customId)
      }
    })

    let guildCount = client.guilds.size
    let userCount = client.users.size
    let nodeJsVer = process.versions.node
    let ocncJsVer = oceanic.Constants.VERSION

    let dataHistory = []
    function updateStats(){
      const cpuUsagePercent = getProcessCpuPercent()
      const ramUsageMb = getProcessRamMb()
      const timestamp = new Date()
      if (dataHistory.length >= graphHistoryCount){
        dataHistory.shift()
      }
      dataHistory.push({
        timestamp,
        cpu: cpuUsagePercent,
        memory: ramUsageMb,
        counts: {
          guild: guildCount,
          users: userCount,
        },
      })
    }

    // Logs
    let logHistory = []

    function createLogs(logHistory, maxLength = logsHistoryCount){
      const consoleMethods = {
        error: console.error,
        warn: console.warn,
        log: console.log,
      }

      Object.entries(consoleMethods).forEach(([type, originalFn])=>{
        console[type] = (...args) => {
          const fullMsg = args.map(arg =>{
            if (arg instanceof Error){
              return arg.stack
            }
            if (typeof arg === "object"){
              return JSON.stringify(arg, null, 2)
            }
            return String(arg)
          }).join(" ")

          logHistory.push({
            msg: fullMsg,
            timestamp: new Date(),
            type,
          })

          if(logHistory.length > maxLength){
            logHistory.shift()
          }

          originalFn(...args)
        }
      })
    }
    createLogs(logHistory, logsHistoryCount)

    setInterval(updateStats, interval)
    updateStats()

    function checkAuthorization(request){
      if (!password){
        return true
      }
      const auth = request.headers.authorization
      if (!auth || !auth.startsWith("Basic ")){
        return false
      }
      const [user, pass] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":")
      return pass === password
    }

    const server = http.createServer((request, response)=>{
      if(!checkAuthorization(request)){
        response.writeHead(401, {
          "www-authenticate": `Basic realm="Process Monitor"`
        })
        return response.end("Unauthorized")
      }

      let endPoint = request.url
      switch(endPoint){
        case "/favicon.ico":
          if (fs.existsSync(icoFilePath)){
            response.writeHead(200, {
              "content-type": "image/x-icon"
            })
            fs.createReadStream(icoFilePath).pipe(response)
          } else {
            response.writeHead(404)
            response.end("Favicon Not Found!")
          }
          break

        case "/monitor":
          response.writeHead(200, {
            "content-type": "text/html"
          })
          let htmlTemplate = fs.readFileSync(htmlFilePath, "utf-8")
          htmlTemplate = htmlTemplate.replaceAll(/\$\{appName\}/g, appName).replaceAll(/\$\{updateInterval\}/g, interval)
          for (let replacement of values.replacements){
            const find = bridge.transf(replacement.data.findText)
            const replace = bridge.transf(replacement.data.replaceText)
            htmlTemplate = htmlTemplate.replaceAll(find, replace)
          }
          response.end(htmlTemplate)
          break

        case "/raw":
          response.writeHead(200, {
            "content-type": "application/json"
          })
          response.end(JSON.stringify({
            prjName: appName,
            data: dataHistory,
            updInterval: interval,
            uptime: process.uptime(),
            startTime: botStartTimestamp,
            logs: logHistory,
            commands: {
              slashCmd: slashCommands.length,
              textCmd: textCommands.length,
              msgCmd: msgCommands.length,
              userCmd: userCommands.length,
              msgCntCmd: msgContentCommands.length,
              anyMsgCmd: anyMessageCommands.length,
              event: events.length,
            },
            versions: {
              node: nodeJsVer,
              oceanic: ocncJsVer,
            },
          }, null, 2))
          break

        default:
          response.writeHead(404)
          response.end("Page Not Found!")
          break
      }
    })

    server.listen(port, host, ()=>{
      console.log(`Status Page Available At "http://user:${password}@${host}:${port}/monitor"`)
    })
  }
}