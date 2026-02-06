modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Split List Into Chunks",
  },
  aliases: [],
  modules: [],
  category: "Lists",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputList",
      name: "List",
    },
    "_",
    {
      element: "input",
      storeAs: "chunkSize",
      name: "Chunk Size",
    },
    "-",
    {
      element: "store",
      storeAs: "chunks",
      name: "Store Chunks As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Split ${values.inputList.type}(${values.inputList.value}) Into ${value.chunkSize} Element Chunks`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let chunks = []
    let chunkSize = parseInt(bridge.transf(values.chunkSize)) || 100
    let inputList = bridge.get(values.inputList)

    if (isNaN(chunkSize)) {
      return console.log(`[${this.data.name}] Chunk Size Is Not A Valid Integer`)
    }

    if (!Array.isArray(inputList)) {
      return console.log(`[${this.data.name}] Input Variable Is Not A List`)
    }

    for (let i = 0; i < inputList.length; i += chunkSize) {
      chunks.push(inputList.slice(i, i + chunkSize))
    }

    bridge.store(values.chunks, chunks)
  },
}
