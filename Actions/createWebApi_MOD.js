modVersion = "v2.0.0"
module.exports = {
  data: {
    name: "Create Web API",
    host: "localhost",
    port: "8080",
    requestData: [
      {
        type: "stores",
        data: {
          body: {
            type: "temporary",
            value: "body",
          },
          headers: {
            type: "temporary",
            value: "headers",
          },
          routeParams: {
            type: "temporary",
            value: "routeParams",
          },
          queryParams: {
            type: "temporary",
            value: "queryParams",
          },
        },
      },
    ],
    endpoints: [
      {
        type: "endpoint",
        data: {
          path: "",
          method: {
            type: "GET",
            value: "",
          },
          actions: [],
          respondCode: {
            type: "200",
            value: "",
          },
          respondWith: {
            type: "tempVar",
            value: "",
          },
        },
      },
    ],
  },
  aliases: [],
  modules: ["node:fs", "node:path", "node:https", "express"],
  category: "WebAPIs",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "host",
      name: "Host",
    },
    "_",
    {
      element: "input",
      storeAs: "port",
      name: "Port",
    },
    "-",
    {
      element: "menu",
      storeAs: "requestData",
      name: "Request Datas",
      max: 1,
      required: true,
      types: { stores: "stores" },
      UItypes: {
        stores: {
          data: {},
          name: "Request Data Storage",
          UI: [
            {
              element: "store",
              storeAs: "body",
              name: "Store Request Body As",
            },
            "_",
            {
              element: "store",
              storeAs: "headers",
              name: "Store Request Headers As",
              help: {
                title: "How To Access Headers",
                UI: [
                  {
                    element: "text",
                    text: `
                    <div style="font-size:20px">
                      To Access Headers, Use JSON Accessors.<br><br>
                      To Access The "apiKey" Header, Do:<br>
                      \${tempVars('headers').apiKey}.
                    </div>`,
                  },
                ],
              },
            },
            "_",
            {
              element: "store",
              storeAs: "routeParams",
              name: "Store Request Route Params As",
              help: {
                title: "How To Access Route Parameters",
                UI: [
                  {
                    element: "text",
                    text: `
                    <div style="font-size:20px">
                      To Access Route Parameters, Use JSON Accessors.<br><br>
                      For Example, Path Is "/ids/:id", To Access The ":id" Wildcard, Do:<br>
                      \${tempVars('routeParams').id}.
                    </div>`,
                  },
                ],
              },
            },
            "_",
            {
              element: "store",
              storeAs: "queryParams",
              name: "Store Request Query Params As",
              help: {
                title: "How To Access Query Parameters",
                UI: [
                  {
                    element: "text",
                    text: `
                    <div style="font-size:20px">
                      To Access Query Parameters, Use JSON Accessors.<br><br>
                      For Example, Client Does "/ids/1234567890?request=id", To Access "request", Do:<br>
                      \${tempVars('headers').request}.
                    </div>`,
                  },
                ],
              },
            },
          ],
        },
      },
    },
    "-",
    {
      element: "menu",
      storeAs: "endpoints",
      name: "Endpoints",
      max: 1000,
      types: { endpoint: "endpoint" },
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
              placeholder: "/endpoint/:wildcard",
            },
            {
              element: "typedDropdown",
              storeAs: "method",
              name: "Method",
              choices: {
                GET: { name: "GET" },
                HEAD: { name: "HEAD" },
                POST: { name: "POST" },
                PUT: { name: "PUT" },
                DELETE: { name: "DELETE" },
                CONNECT: { name: "CONNECT" },
                OPTIONS: { name: "OPTIONS" },
                TRACE: { name: "TRACE" },
                PATCH: { name: "PATCH" },
              },
            },
            "_",
            {
              element: "actions",
              storeAs: "actions",
              name: "Actions",
            },
            "-",
            {
              element: "typedDropdown",
              storeAs: "respondCode",
              name: "Respond Code",
              choices: {
                200: { name: "200 OK" },
                302: { name: "302 Redirect" },
              },
            },
            "_",
            {
              element: "variable",
              storeAs: "respondWith",
              name: "Respond With",
              also: {
                string: "Text / Redirect URL",
              },
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
    "_",
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

  subtitle: (values) => `Start ${values.endpoints.length} HTTP Endpoints`,
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const express = require("express")
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

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    let requestDataStores = values.requestData[0].data

    const normalizePath = (p) => {
      if (!p.startsWith("/")) p = "/" + p
      p = p.replace(/^\/+/, "/")
      p = p.replace(/\/{2,}/g, "/")
      return p
    }

    const host = bridge.transf(values.host) || "localhost"
    const port = parseInt(bridge.transf(values.port)) || 8080

    let routeMap = {}
    let conflictWarnings = []

    for (let endpoint of values.endpoints) {
      let endpointData = endpoint.data
      let method = (endpointData.method.type || "GET").toLowerCase()
      let routePath = normalizePath(bridge.transf(endpointData.path) || "/endpoint")

      if (!routeMap[routePath]) routeMap[routePath] = {}
      if (routeMap[routePath][method]) {
        conflictWarnings.push(`${method.toUpperCase()} ${routePath}`)
        continue
      }

      routeMap[routePath][method] = {
        respondCode: endpointData.respondCode,
        respondWith: endpointData.respondWith,
      }

      if (values.logSetup) {
        console.log(`[Create Web API] Register ${method.toUpperCase()} ${routePath}`)
      }

      app[method](routePath, async (request, response) => {
        try {
          if (values.logRequests) {
            console.log(`[Create Web API] Hit ${method.toUpperCase()} ${routePath}`)
            console.log(
              JSON.stringify(
                {
                  url: request.originalUrl,
                  method: request.method,
                  params: request.params,
                  query: request.query,
                  headers: request.headers,
                  body: request.body,
                },
                null,
                2
              )
            )
          }

          bridge.store(requestDataStores.body, request.body)
          bridge.store(requestDataStores.headers, request.headers)
          bridge.store(requestDataStores.queryParams, request.query)
          bridge.store(requestDataStores.routeParams, request.params)

          await bridge.runner(endpointData.actions, message, client, bridge.variables)

          let respondWith = bridge.get(endpointData.respondWith)
          let code = endpointData.respondCode.type || "200"

          if (code === "301" || code === "302") {
            let target
            if (endpointData.respondWith.type == "string") {
              target = bridge.transf(endpointData.respondWith.value)
            } else {
              target = bridge.get(endpointData.respondWith)
            }
            return response.redirect(parseInt(code), target)
          }

          let type = "text"
          let content = respondWith

          if (typeof respondWith === "object" && respondWith.constructor === Object) {
            type = "json"
          } else if (typeof respondWith === "string") {
            let t = respondWith.trim()
            if (t.startsWith("<!DOCTYPE html") || t.startsWith("<html")) type = "html"
            else if (t.startsWith("<?xml") || /^<[\w:-]+[\s>]/.test(t)) type = "xml"
          }

          switch (type) {
            case "json":
              return response.status(200).json(content)

            case "html":
              response.set("Content-Type", "text/html")
              return response.status(200).send(content)

            case "xml":
              response.set("Content-Type", "application/xml")
              return response.status(200).send(content)

            default:
              response.set("Content-Type", "text/plain")
              return response.status(200).send(String(content))
          }
        } catch (err) {
          console.error(`[Create Web API] ERROR In Handler For ${routePath}:`, err)
          return response.status(500).send("Internal Server Error")
        }
      })
    }

    try {
      let routesFilePath = path.join(projectFolder, "aceModsJSON", "webapiRoutes.json")
      fs.writeFileSync(routesFilePath, JSON.stringify(routeMap, null, 2))
      if (values.logSetup) {
        console.log(`[Create Web API] webApiRoutes.json Generated.`)
      }
    } catch (err) {
      console.error("[Create Web API] Failed To Write webApiRoutes.json:", err)
    }

    if (conflictWarnings.length > 0) {
      console.warn("[Create Web API] Duplicate Or Conflicting Routes Detected:")
      for (let warning of conflictWarnings) console.warn("  - " + warning)
    }

    if (values.https[0] && values.https.length > 0) {
      const https = require("node:https")
      try {
        if (!values.https[0].data.keyFile || !values.https[0].data.certFile) {
          throw new Error(`Missing Key Or Cert File`)
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
          console.log(`[Create Web API] Upgrade To HTTPS Success`)
          console.log(`[Create Web API] Listening On https://${host}:${port}`)
        })
      } catch (err) {
        console.log(err)
        console.log(`[Create Web API] Upgrade To HTTPS Fail, Defaulting To HTTP`)
        app.listen(port, host, () => {
          console.log(`[Create Web API] Listening On http://${host}:${port}`)
        })
      }
    } else {
      app.listen(port, host, () => {
        console.log(`[Create Web API] Listening On http://${host}:${port}`)
      })
    }
  },
}
