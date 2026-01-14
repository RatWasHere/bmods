modVersion = "v1.0.2"
module.exports = {
  data: {
    name: "Get JSON From WebAPI v2",
    headers: [
      {
        type: "header",
        data: {
          headerKey: "Accept",
          headerValue: "application/json",
        },
      },
      {
        type: "header",
        data: {
          headerKey: "User-Agent",
          headerValue: "bmd/bmods",
        },
      },
    ],
  },
  aliases: [],
  modules: [],
  category: "WebAPIs",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "url",
      name: "URL",
    },
    "_",
    {
      element: "menu",
      storeAs: "headers",
      name: "Headers",
      types: { header: "header" },
      max: 100,
      UItypes: {
        header: {
          data: {},
          name: "Header:",
          preview: "`${option.data.headerKey || ''}`",
          UI: [
            {
              element: "input",
              storeAs: "headerKey",
              name: "Header Key",
            },
            "-",
            {
              element: "largeInput",
              storeAs: "headerValue",
              name: "Value",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "response",
      name: "Store Response As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Get JSON Response From ${values.url}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let url = bridge.transf(values.url)
    let headers = {}

    for (let header of values.headers) {
      let headerData = header.data
      let headerKey = bridge.transf(headerData.headerKey).trim() || undefined
      let headerValue = bridge.transf(headerData.headerValue).trim() || undefined
      if (headerKey !== undefined && headerValue !== undefined && !headers[headerKey]) {
        headers[headerKey] = headerValue
      }
    }

    let response = await fetch(url, {
      method: "GET",
      headers,
    })

    let responseResult
    if (!response.ok) {
      console.log(`[${this.data.name}] Fetch Error: [${response.status}] ${url}: ${response.statusText}`)
    } else {
      let responseText = await response.text()
      try {
        responseResult = JSON.parse(responseText)
      } catch {
        responseResult = responseText
      }
    }

    bridge.store(values.response, responseResult)
  },
}
