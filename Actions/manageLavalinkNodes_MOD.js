modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "Manage Lavalink Nodes",
  },
  aliases: ["Add Lavalink Node", "Remove Lavalink Node", "Test Lavalink Node", "Get Lavalink Nodes"],
  modules: ["lavalink-client"],
  category: "Lavalink Music",
  info: {
    source: "https://github.com/slothyacedia/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "typedDropdown",
      storeAs: "action",
      name: "Action",
      choices: {
        add: { name: "Add Node", field: false },
        remove: { name: "Remove Node", field: false },
        test: { name: "Test Node Connectivity", field: false },
        list: { name: "Get Lavalink Nodes", field: false },
      },
    },
    "-",
    {
      element: "variable",
      storeAs: "node",
      name: "Node",
      help: {
        title: "Node",
        UI: [
          {
            element: "text",
            text: "This Variable Takes Priority Over Manual Details",
          },
        ],
      },
    },
    "_",
    {
      element: "text",
      text: "OR",
      header: true,
      storeAs: "orText",
    },
    "_",
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
    {
      element: "input",
      storeAs: "password",
      name: "Password",
    },
    {
      element: "input",
      storeAs: "nodeName",
      name: "Node Name",
    },
    "_",
    {
      element: "store",
      storeAs: "result",
      name: "Store Result As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let subtitle
    switch (values.action.type) {
      case "add": {
        subtitle = `Add Node ${values.host || ""}:${values.port || ""} (${values.nodeName || ""})`
        break
      }

      case "remove": {
        let subtitlePart = values.node.value ? `${values.node.type}(${values.node.value})` : values.nodeName || ""
        subtitle = `Remove Node ${subtitlePart}`
        break
      }

      case "test": {
        let subtitlePart = values.node.value ? `${values.node.type}(${values.node.value})` : `${values.host || ""}:${values.port || ""}`
        subtitle = `Test Node Connectivity ${subtitlePart}`
        break
      }

      case "list": {
        subtitle = `List Nodes`
        break
      }
    }
    return subtitle
  },

  script: (values) => {
    // Find Element By StoreAs
    const indexByStoreAs = (values, storeAs) => {
      if (typeof storeAs != "string") {
        return console.log("Not String")
      }
      let index = values.UI.findIndex((element) => element.storeAs == storeAs)
      console.log(index)
      if (index == -1) {
        return console.log("Index Not Found")
      }
      return index
    }

    function reflem(skipAnimation) {
      let action = values.data.action.type

      switch (action) {
        case "add": {
          values.UI[indexByStoreAs(values, "host")].element = "input"
          values.UI[indexByStoreAs(values, "port")].element = "input"
          values.UI[indexByStoreAs(values, "password")].element = "input"
          values.UI[indexByStoreAs(values, "nodeName")].element = "input"
          values.UI[indexByStoreAs(values, "orText")].element = ""
          values.UI[indexByStoreAs(values, "node")].element = ""
          break
        }

        case "remove": {
          values.UI[indexByStoreAs(values, "host")].element = ""
          values.UI[indexByStoreAs(values, "port")].element = ""
          values.UI[indexByStoreAs(values, "password")].element = ""
          values.UI[indexByStoreAs(values, "nodeName")].element = "input"
          values.UI[indexByStoreAs(values, "orText")].element = "text"
          values.UI[indexByStoreAs(values, "node")].element = "variable"
          break
        }

        case "test": {
          values.UI[indexByStoreAs(values, "host")].element = "input"
          values.UI[indexByStoreAs(values, "port")].element = "input"
          values.UI[indexByStoreAs(values, "password")].element = "input"
          values.UI[indexByStoreAs(values, "nodeName")].element = "input"
          values.UI[indexByStoreAs(values, "orText")].element = "text"
          values.UI[indexByStoreAs(values, "node")].element = "variable"
          break
        }

        case "list": {
          values.UI[indexByStoreAs(values, "host")].element = ""
          values.UI[indexByStoreAs(values, "port")].element = ""
          values.UI[indexByStoreAs(values, "password")].element = ""
          values.UI[indexByStoreAs(values, "nodeName")].element = ""
          values.UI[indexByStoreAs(values, "orText")].element = ""
          values.UI[indexByStoreAs(values, "node")].element = ""
          break
        }
      }

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100,
      )
    }

    reflem(true)
    values.events.on("change", () => {
      reflem()
    })
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let action = bridge.transf(values.action.type)

    if (!client.lavalink?.nodeManager) {
      console.log(`[${this.data.name}] No Lavalink Client Initiated`)
      return
    }

    switch (action) {
      case "add": {
        let host = bridge.transf(values.host)
        let port = Number(bridge.transf(values.port))
        let authorization = bridge.transf(values.password)
        let id = bridge.transf(values.nodeName)
        if (!host || !port || !authorization || !id) {
          console.log(`[${this.data.name}] Missing Credentials For Adding Node`)
          return
        }

        if (client.lavalink.nodeManager.nodes.get(id)) {
          console.log(`[${this.data.name}] Node ${id} Already Exists, Try A Different Name`)
          bridge.store(values.result, "alreadyExists")
          return
        }

        let newNode = client.lavalink.nodeManager.createNode({
          host,
          port,
          authorization,
          id,
        })

        try {
          await newNode.connect()
          bridge.store(values.result, "success")
        } catch (err) {
          console.log(`[${this.data.name}] Add Node Failed `, err)
          bridge.store(values.result, "fail")
        }
        break
      }

      case "remove": {
        let inputNode = values.node.value ? bridge.get(values.node) : undefined
        let id = inputNode?.id || bridge.transf(values.nodeName)

        if (!id) {
          console.log(`[${this.data.name}] Please Input A Node Name (id) To Remove`)
          return
        }

        let node = client.lavalink.nodeManager.nodes.get(id)

        if (!node) {
          console.log(`[${this.data.name}] No Existing Node With Name ${id}`)
          return
        }

        try {
          let players = client.lavalink.players.filter((player) => player.node.id === id)
          for (let player of players) {
            await player.destroy()
          }

          node.disconnect()
          client.lavalink.nodeManager.deleteNode(node)
          console.log(`[${this.data.name}] Node ${id} Removed`)
          bridge.store(values.result, "success")
        } catch (err) {
          console.log(`[${this.data.name}] Node ${id} Removal Failed`)
          bridge.store(values.result, "fail")
        }
        break
      }

      case "test": {
        let inputNode = values.node.value ? bridge.get(values.node) : undefined
        let host = inputNode?.options.host || bridge.transf(values.host)
        let port = inputNode?.options.port || Number(bridge.transf(values.port))
        let authorization = inputNode?.options.authorization || bridge.transf(values.password)

        let past
        let current
        try {
          past = Date.now()
          let response = await fetch(`http://${host}:${port}/v4/info`, {
            headers: {
              Authorization: authorization,
            },
          })
          current = Date.now()

          let diff = current - past

          if (!response.ok) {
            console.log(`[${this.data.name}] No Response From Node`)
            bridge.store(values.result, "offline")
            return
          }

          let responseJSON = await response.json()
          console.log(`[${this.data.name}] Node Is Valid Lavalink, v${responseJSON.version.semver}`)
          bridge.store(values.result, { status: "online", ping: diff })
        } catch (err) {
          console.log(`[${this.data.name}] Node Test Failed `, err)
          bridge.store(values.result, "error")
        }
        break
      }

      case "list": {
        try {
          let nodes = [...client.lavalink.nodeManager.nodes.values()]
          bridge.store(values.result, nodes)
        } catch (err) {
          console.log(`[${this.data.name}] Failed To Fetch All Nodes`)
          bridge.store(values.result, undefined)
        }
        break
      }
    }
  },
}
