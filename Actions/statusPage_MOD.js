modVersion = "v4.1.2"
module.exports = {
  data: {
    name: "Start Status Page",
    host: "localhost",
    port: "3000",
    historyCountgraph: "60",
    historyCountconsole: "1000",
    updateInterval: "2.5",
    theme: "default",
    autoUpdateFiles: true,
  },
  aliases: ["Status Page"],
  modules: ["node:fs", "node:path", "node:https", "node:crypto", "express", "cookie-parser"],
  category: "Utilities",
  modVersion,
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia & qizzle",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "inputGroup",
      storeAs: ["host", "port"],
      nameSchemes: ["Host", "Port"],
      placeholder: ["localhost", "3000"],
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["username", "password"],
      nameSchemes: ["Login Username", "Login Password"],
      placeholder: ["user", "password"],
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "loginSystem",
      name: "Login System",
      choices: {
        basic: { name: "Basic Login", field: false },
        token: { name: "Token Login", field: true, placeholder: "Token Validity (In Hours)" },
      },
    },
    "-",
    {
      element: "inputGroup",
      storeAs: ["historyCountgraph", "historyCountconsole"],
      nameSchemes: ["History Count - Graph", "History Count - Console"],
      placeholder: ["60", "1000"],
    },
    "_",
    {
      element: "input",
      storeAs: "interval",
      name: "Graph Update Interval (In Seconds)",
      placeholder: 2.5,
    },
    "-",
    {
      element: "input",
      storeAs: "theme",
      name: "Theme",
      placeholder: "default",
      help: {
        title: "Themes",
        UI: [
          {
            element: "text",
            text: `
              <div style="text-align=left">
              Check Out Available Themes On GitHub
              <button class="hoverablez" style="width: fit-content;" onclick="require('electron').shell.openExternal('https://github.com/slothyace/bmd-statusPage/tree/main/themes')">
              <btext>Explore Themes</btext>
              </button>
              </div>
              `,
          },
        ],
      },
    },
    "_",
    {
      element: "toggle",
      storeAs: "autoUpdateFiles",
      name: "Check For Lastest Versions Of Files?",
    },
    "-",
    {
      element: "menu",
      storeAs: "https",
      name: "Upgrade To HTTPS",
      max: 1,
      types: { certs: "certs" },
      UItypes: {
        certs: {
          data: {
            keyFile: "key.pem",
            certFile: "cert.pem",
          },
          name: "HTTPS Certs",
          UI: [
            {
              element: "input",
              storeAs: "keyFile",
              name: "Key File Path",
            },
            {
              element: "input",
              storeAs: "certFile",
              name: "Certificate File Path",
            },
            {
              element: "input",
              storeAs: "certChainFile",
              name: "Certificate Chain File Path",
              placeholder: "(Optional)",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Start Status Page On ${values.host}:${values.port}`
  },

  init: (values, bridge) => {
    const path = require("node:path")
    const fs = require("node:fs")

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc
    } else {
      projectFolder = workingDir
    }

    let tokensFilePath = path.join(projectFolder, "statusPage", "core", "activeTokens.json")
    if (!fs.existsSync(tokensFilePath)) {
      fs.mkdirSync(path.dirname(tokensFilePath), { recursive: true })
      fs.writeFileSync(tokensFilePath, "{}")
    }

    var cache = JSON.parse(fs.readFileSync(tokensFilePath))
    let getActiveTokens = () => {
      return bridge.data.IO.statusPage.cache
    }
    let writeActiveTokens = (data) => {
      bridge.data.IO.statusPage.cache = JSON.parse(JSON.stringify(data))
      try {
        fs.writeFileSync(tokensFilePath, JSON.stringify(bridge.data.IO.statusPage.cache, null, 2))
      } catch {}
    }
    let deleteExpiredTokens = () => {
      let activeTokens = bridge.data.IO.statusPage.get()
      for (let token in activeTokens) {
        if (activeTokens[token].expiry < Date.now()) {
          delete activeTokens[token]
        }
      }
      bridge.data.IO.statusPage.write(activeTokens)
    }

    bridge.data.IO.statusPage = {
      get: getActiveTokens,
      write: writeActiveTokens,
      cache,
      cleanse: deleteExpiredTokens,
    }
    bridge.data.IO.statusPage.cleanse()
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const path = require("node:path")
    const fs = require("node:fs")
    const crypto = require("node:crypto")
    const oceanic = require("oceanic.js")
    const express = require("express")
    const cookieParser = require("cookie-parser")

    let host = bridge.transf(values.host) || "localhost"
    let port = parseInt(bridge.transf(values.port), 10) || 3000

    let username = bridge.transf(values.username) || "user"
    let password = bridge.transf(values.password) || "password"
    let loginSystem = bridge.transf(values.loginSystem.type) || "basic"

    let historyCount_graph = parseInt(bridge.transf(values.historyCountgraph), 10) || 60
    let historyCount_console = parseInt(bridge.transf(values.historyCountconsole), 10) || 1000
    let interval = parseFloat(bridge.transf(values.interval)) * 1000 || 2500
    let theme = bridge.transf(values.theme) || "default"

    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())
    let projectFolder
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      projectFolder = botData.prjSrc
    } else {
      projectFolder = workingDir
    }

    const botStartTS = Date.now() - process.uptime() * 1000

    let themeDir = path.join(projectFolder, "statusPage", "themes", theme)
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir, { recursive: true })
    }

    let siteFiles = {
      html: {
        source: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/index.html`,
        path: path.join(themeDir, "index.html"),
        name: "index.html",
        required: true,
        type: "theme",
      },
      css: {
        source: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/style.css`,
        path: path.join(themeDir, "style.css"),
        name: `style.css`,
        required: false,
        type: "theme",
      },
      icon: {
        source: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/bmd.ico`,
        path: path.join(themeDir, "bmd.ico"),
        name: `bmd.ico`,
        required: false,
        type: "theme",
      },
    }

    if (loginSystem === "token") {
      siteFiles["login"] = {
        source: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/core/login.html`,
        path: path.join(projectFolder, "statusPage", "core", "login.html"),
        name: `login.html`,
        required: true,
        type: "core",
      }
    }

    let fileHashesRaw = await fetch(`https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/file-hashes.json`)
    let fileHashes = await fileHashesRaw.json()

    for (let entry in siteFiles) {
      file = siteFiles[entry]
      if (fs.existsSync(file.path)) {
        if (values.autoUpdateFiles == true) {
          let fileHash = crypto.createHash("md5").update(fs.readFileSync(file.path)).digest("hex")
          switch (file.type) {
            case "theme": {
              if (fileHash !== fileHashes.themes[theme][file.name]) {
                console.log(`[Status Page] ${file.name} Is Outdated, Redownloading...`)
                try {
                  let newFileRaw = await fetch(file.source)
                  let newFileBuffer = Buffer.from(await newFileRaw.arrayBuffer())
                  fs.writeFileSync(file.path, newFileBuffer)
                  console.log(`[Status Page] ${file.name} Has Been Redownloaded.`)
                } catch (err) {
                  console.log(`[Status Page] Something Went Wrong Trying To Redownload ${file.name}`)
                }
              }
              break
            }

            case "core": {
              if (fileHash !== fileHashes.core[file.name]) {
                console.log(`[Status Page] ${file.name} Is Outdated, Redownloading...`)
                try {
                  let newFileRaw = await fetch(file.source)
                  let newFileBuffer = Buffer.from(await newFileRaw.arrayBuffer())
                  fs.writeFileSync(file.path, newFileBuffer)
                  console.log(`[Status Page] ${file.name} Has Been Redownloaded.`)
                } catch (err) {
                  console.log(`[Status Page] Something Went Wrong Trying To Redownload ${file.name}`)
                }
              }
              break
            }
          }
        }
      } else {
        console.log(`[Status Page] ${file.name} Missing, Downloading...`)
        try {
          let newFileRaw = await fetch(file.source)
          let newFileBuffer = Buffer.from(await newFileRaw.arrayBuffer())
          fs.writeFileSync(file.path, newFileBuffer)
          console.log(`[Status Page] ${file.name} Has Been Downloaded.`)
        } catch (err) {
          console.log(`[Status Page] Something Went Wrong Trying To Download ${file.name}`)
        }
      }
    }

    // Usage Values
    let lastCpuUsage = process.cpuUsage()
    let lastCpuTime = process.hrtime()
    function getCpuUsage() {
      let currentCpu = process.cpuUsage(lastCpuUsage)
      let currentTime = process.hrtime(lastCpuTime)
      lastCpuUsage = process.cpuUsage()
      lastCpuTime = process.hrtime()
      let elapsedMS = currentTime[0] * 1e6 + currentTime[1] / 1000
      let titleCpuUsage = currentCpu.user + currentCpu.system
      return ((titleCpuUsage / elapsedMS) * 100).toFixed(2)
    }

    function getRamUsage() {
      return (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)
    }

    // Logging Stuff
    let logHistory = []
    function pushLog(entry) {
      logHistory.push(entry)
      if (logHistory.length > historyCount_console) {
        logHistory = logHistory.slice(-historyCount_console)
      }
    }

    let consoleMethods = ["log", "info", "warn", "error", "debug"]
    consoleMethods.forEach((method) => {
      const originalFunc = console[method]
      console[method] = (...args) => {
        originalFunc(...args)
        let fullMessage = args
          .map((arg) => {
            if (arg instanceof Error) {
              return arg.stack
            }
            if (typeof arg === "object") {
              return JSON.stringify(arg)
            }
            return String(arg)
          })
          .join(" ")

        let entry = {
          type: method,
          msg: fullMessage,
          timestamp: new Date(),
        }
        pushLog(entry)
      }
    })

    // Bot Infos
    let commandCounts = {
      slashCommand: 0,
      textCommand: 0,
      message: 0,
      user: 0,
      msgContent: 0,
      anyMessage: 0,
      event: 0,
    }

    for (let command of botData.commands) {
      if (commandCounts[command.trigger] !== undefined) {
        commandCounts[command.trigger]++
      }
    }

    // Versions
    const nodeJsVer = process.versions.node
    const ocncJsVer = oceanic.Constants.VERSION
    const statusPageVer = this.modVersion

    // Graph Datas
    let dataHistory = []
    function updateStats() {
      let cpu = getCpuUsage()
      let memory = getRamUsage()
      let timestamp = new Date()
      let guild = client.guilds.size
      let users = client.users.size
      dataHistory.push({
        timestamp,
        cpu,
        memory,
        counts: {
          guild,
          users,
        },
      })
      if (dataHistory.length > historyCount_graph) {
        dataHistory = dataHistory.slice(-historyCount_graph)
      }
    }

    // Authentication
    function checkAuthenticated(request, response) {
      let activeTokens = bridge.data.IO.statusPage.get()
      switch (loginSystem) {
        case "basic": {
          let authHeaders = request.headers.authorization
          if (!authHeaders || !authHeaders.startsWith("Basic ")) {
            response.set("WWW-Authenticate", `Basic Realm = "StatusPage"`)
            response.status(401).send("Unauthorized")
            return false
          }

          let decodedAuthorization = Buffer.from(authHeaders.split(" ")[1], "base64").toString()
          let [loginUsername, loginPassword] = decodedAuthorization.split(":")
          if (String(loginUsername) == username && String(loginPassword) == password) {
            return true
          } else {
            return false
          }
          break
        }

        case "token": {
          let token = request.cookies?.spToken
          if (token && activeTokens[token] && activeTokens[token].expiry > Date.now()) {
            return true
          } else {
            let redirect = encodeURIComponent(request.originalUrl)
            return response.redirect(302, `/statusPage/login?redirect=${redirect}`)
          }
        }
      }
    }

    // Missing Files?
    let missingFiles = []
    for (let entry in siteFiles) {
      let file = siteFiles[entry]
      if (!fs.existsSync(file.path) && file.required == true) {
        missingFiles.push(file.name)
      }
    }

    if (missingFiles.length > 0) {
      return console.error(`[Status Page] Files Required To Run The Status Page Are Missing; ${missingFiles.join(", ")}`)
    }
    setInterval(updateStats, interval)
    updateStats()

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())

    app.get(`/statusPage/monitor/view`, (request, response) => {
      if (checkAuthenticated(request, response) == true) {
        response.sendFile(siteFiles.html.path)
      }
    })
    app.get(`/statusPage/monitor/style.css`, (request, response) => {
      if (checkAuthenticated(request, response) == true) {
        response.sendFile(siteFiles.css.path)
      }
    })
    app.get(`/statusPage/monitor/favicon.ico`, (request, response) => {
      if (fs.existsSync(siteFiles.icon.path)) {
        return response.sendFile(siteFiles.icon.path)
      } else {
        return response.redirect(`https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/default/bmd.ico`)
      }
    })
    app.get(`/statusPage/login`, (request, response) => {
      if (loginSystem == "basic") {
        return response.redirect(`/statusPage/monitor/view`)
      }

      let token = request.cookies?.spToken
      let activeTokens = bridge.data.IO.statusPage.get()
      if (token && activeTokens[token] && activeTokens[token].expiry > Date.now()) {
        return response.redirect(`/statusPage/monitor/view`)
      }

      return response.sendFile(siteFiles.login.path)
    })
    app.post(`/statusPage/login/authenticate`, (request, response) => {
      let requestBody = request.body
      let activeTokens = bridge.data.IO.statusPage.get()
      let token = request.headers?.spToken
      if (!token) {
        if (String(requestBody.username) === username && String(requestBody.password) === password) {
          let newToken = crypto.randomBytes(32).toString("hex")
          activeTokens[newToken] = {
            tokenId: newToken,
            expiry: Date.now() + (parseFloat(bridge.transf(values.loginSystem.value)) || 24) * 3600000,
            client: requestBody.username,
            browser: request.headers["user-agent"],
          }
          let origin = request.query.redirect
          response.cookie("spToken", newToken, { path: "/", sameSite: "lax" })
          bridge.data.IO.statusPage.write(activeTokens)
          return response.status(200).json({ success: true, redirect: requestBody.redirect })
        } else {
          return response.status(401).json({ success: false, error: "Invalid Login" })
        }
      }
    })
    app.get(`/statusPage/monitor/raw`, (request, response) => {
      if (checkAuthenticated(request, response) == true) {
        response.set("content-type", "application/json").send(
          JSON.stringify(
            {
              prjName: botData.name || "BMD Project",
              data: dataHistory,
              updInterval: interval,
              uptime: process.uptime(),
              startTime: botStartTS,
              logs: logHistory,
              commands: {
                slashCmd: commandCounts.slashCommand,
                textCmd: commandCounts.textCommand,
                msgCmd: commandCounts.message,
                userCmd: commandCounts.user,
                msgCntCmd: commandCounts.msgContent,
                anyMsgCmd: commandCounts.anyMessage,
                event: commandCounts.event,
              },
              versions: {
                node: nodeJsVer,
                oceanic: ocncJsVer,
                statusPage: statusPageVer,
              },
            },
            null,
            2
          )
        )
      }
    })

    if (values.https[0] && values.https.length > 0) {
      const https = require("node:https")
      try {
        if (!values.https[0].data.keyFile || !values.https[0].data.certFile) {
          throw new Error(`[Status Page] Missing Key Or Cert File`)
        }

        let keyFile = path.join(projectFolder, bridge.transf(values.https[0].data.keyFile).trim()) || undefined
        let certFile = path.join(projectFolder, bridge.transf(values.https[0].data.certFile).trim()) || undefined
        let certChainFile = path.join(projectFolder, bridge.transf(values.https[0].data.certChainFile).trim()) || undefined
        let key, cert, ca

        key = fs.readFileSync(keyFile)
        cert = fs.readFileSync(certFile)
        if (values.https[0].data.certChainFile) {
          ca = fs.readFileSync(certChainFile)
        }
        let options = { key, cert, ca }
        https.createServer(options, app).listen(port, host, () => {
          console.log(`[Status Page] Upgrade To HTTPS Success`)
          console.log(`[Status Page] Status Page Available On https://${host}:${port}/statusPage/monitor/view`)
        })
      } catch (err) {
        console.log(err)
        console.log(`[Status Page] Upgrade To HTTPS Fail, Defaulting To HTTP`)
        app.listen(port, host, () => {
          console.log(`[Status Page] Status Page Available On http://${host}:${port}/statusPage/monitor/view`)
        })
      }
    } else {
      app.listen(port, host, () => {
        console.log(`[Status Page] Status Page Available On http://${host}:${port}/statusPage/monitor/view`)
      })
    }
  },
}
