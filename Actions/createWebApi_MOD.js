modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Create Web API",
    host: "localhost",
    port: "8080",
  },
  aliases: [],
  modules: ["node:http", "node:url", "node:fs", "node:path"],
  category: "Utilities",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "host",
      name: "Host",
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port",
    },
    "-",
    {
      element: "store",
      storeAs: "body",
      name: "Store Request Body As",
    },
    {
      element: "store",
      storeAs: "headers",
      name: "Store Request Headers As",
    },
    "-",
    {
      element: "menu",
      storeAs: "endpoints",
      name: "Endpoints",
      max: 1000,
      types: {
        endpoint: "endpoint",
      },
      UItypes: {
        endpoint: {
          data: {},
          name: "Endpoint",
          preview: "`${option.data.path||'/endpoint'} | ${option.data.method.type||'GET'}`",
          UI: [
            {
              element: "input",
              storeAs: "path",
              name: "Endpoint",
              placeholder: "/endpoint",
            },
            {
              element: "typedDropdown",
              storeAs: "method",
              name: "Method",
              choices: {
                GET: { name: "GET", field: false },
                HEAD: { name: "HEAD", field: false },
                POST: { name: "POST", field: false },
                PUT: { name: "PUT", field: false },
                DELETE: { name: "DELETE", field: false },
                CONNECT: { name: "CONNECT", field: false },
                OPTIONS: { name: "OPTIONS", field: false },
                TRACE: { name: "TRACE", field: false },
                PATCH: { name: "PATCH", field: false },
              },
            },
            {
              element: "actions",
              storeAs: "actions",
              name: "Actions",
            },
            {
              element: "variable",
              storeAs: "respondWith",
              name: "Respond With",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "toggleGroup",
      storeAs: ["logRequests", "logSetup"],
      nameSchemes: ["Log Requests?", "Log Setup?"],
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Start ${values.endpoints.length} HTTP Endpoints`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const http = require("node:http")
    const { parse } = require("node:url")
    const fs = require("node:fs")
    const path = require("node:path")
    const botData = require("../data.json")
    const workingDir = path.normalize(process.cwd())

    let workingPath
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      workingPath = botData.prjSrc
    } else {
      workingPath = workingDir
    }

    let routesFilePath = path.join(workingPath, "aceModsJSON", "webapiRoutes.json")

    let host = bridge.transf(values.host) || "localhost"
    let port = parseInt(bridge.transf(values.port)) || "8080"
    let endpoints = values.endpoints || []

    let routeMap = {}

    for (let endpoint of endpoints) {
      let endpointPath = bridge.transf(endpoint.data.path) || "/endpoint"
      let method = bridge.transf(endpoint.data.method.type).toUpperCase() || "GET"

      if (!endpointPath.startsWith("/")) {
        endpointPath = `/${endpointPath}`
      }

      endpointPath = endpointPath.replaceAll("//", "/")

      if (!routeMap[endpointPath]) {
        routeMap[endpointPath] = {}
      }

      if (routeMap[endpointPath] && routeMap[endpointPath][method]) {
        if (values.logSetup) {
          console.log(`[Create Web API] ${endpointPath} [${method}] Has Already Been Registered.\n`)
        }
        continue
      }

      routeMap[endpointPath][method] = {
        actions: endpoint.data.actions,
        respondWith: endpoint.data.respondWith,
      }
      if (values.logSetup) {
        console.log(`[Create Web API] ${endpointPath} [${method}] Has Been Registered.\n`)
      }
    }

    if (values.logSetup) {
      console.log(`[Create Web API] All Endpoints Registered.\n`)
      console.log(`[Create Web API] webapiRoutes.json Generated.\n`)
    }

    fs.writeFileSync(routesFilePath, JSON.stringify(routeMap, null, 2))
    const server = http.createServer(async (request, response) => {
      let method = request.method.toUpperCase()
      let pathName = parse(request.url).pathname

      let endPointActions = routeMap[pathName]?.[method]
      if (!endPointActions) {
        response.writeHead(404)
        return response.end("Page Not Found!")
      }

      if (values.logRequests) {
        let safeLog = {
          url: request.url,
          method: request.method,
          headers: request.headers,
          remoteAddress: request.socket?.remoteAddress,
        }
        console.log(`[Create Web API] The ${pathName} [${method}] Endpoint Has Been Called. ${JSON.stringify(safeLog, null, 2)}\n`)
      }

      let body = ""
      request.on("data", (chunk) => (body += chunk))
      request.on("end", async () => {
        if (values.logRequests) {
          console.log(`[Create Web API] ${body}`)
        }

        try {
          body = JSON.parse(body)
        } catch (err) {
          body = body
        }

        bridge.store(values.body, body)
        bridge.store(values.headers, request.headers)

        await bridge.runner(endPointActions.actions, message, client, bridge.variables)
        let respondWith = bridge.get(endPointActions.respondWith)

        let respondContent = respondWith
        let contentType = "text/plain"

        if (typeof respondContent == "object" && respondContent.constructor === Object) {
          contentType = "application/json"
          respondContent = JSON.stringify(respondContent, null, 2)
        } else if (typeof respondContent == "string" && respondContent.trim().startsWith("<")) {
          contentType = "text/html"
        }

        response.writeHead(200, {
          "content-type": contentType,
        })
        response.end(respondContent?.toString() ?? "")
      })
    })

    server.listen(port, host, () => {
      console.log(`[Create Web API] Listening For Requests.\n`)
    })
  },
}
