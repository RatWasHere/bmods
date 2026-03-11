modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Fuzzy Search In List",
  },
  aliases: [],
  modules: [],
  category: "Search",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "list",
      name: "Input List",
    },
    {
      element: "input",
      storeAs: "attribute",
      name: "Attribute",
      placeholder: "dot.notation.supported",
    },
    "-",
    {
      element: "input",
      storeAs: "query",
      name: "Data Key Query",
    },
    {
      element: "input",
      storeAs: "minScore",
      name: "Score Threshold",
      placeholder: "0-1",
    },
    "-",
    {
      element: "input",
      storeAs: "top",
      name: "Only Store Top # | Leave Empty To Return Whole List",
    },
    {
      element: "store",
      storeAs: "result",
      name: "Store Results As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Fuzzy Search For ${values.query} In List ${constants.variable(values.list)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    function isJSON(testObject) {
      return testObject != undefined && typeof testObject === "object" && testObject.constructor === Object
    }

    let inputList = bridge.get(values.list)
    if (!Array.isArray(inputList)) {
      return console.log(`[${this.data.name}] Input Is Not A List`)
    }
    let minScore = parseFloat(bridge.transf(values.minScore))
    if (isNaN(minScore)) minScore = 0

    let cloneList = inputList
    if (values.attribute && values.attribute.trim() !== "") {
      if (!inputList.every(isJSON)) {
        return console.log(`[${this.data.name}] Not Every Element Is A JSON Object`)
      }

      let attributePath = bridge.transf(values.attribute)
      let attributeParts = attributePath.split(".").filter(Boolean)
      cloneList = cloneList.map((el) => {
        let current = el
        for (let part of attributeParts) {
          if (current != undefined && Object.prototype.hasOwnProperty.call(current, part)) {
            current = current[part]
          } else {
            current = undefined
          }
        }
        return current
      })
    }

    let query = bridge.transf(values.query).toLowerCase().replace(/\s+/g, "")
    let top = parseInt(bridge.transf(values.top)) || cloneList.length

    let inputTrigrams = new Set()
    for (let i = 0; i < query.length - 2; i++) {
      inputTrigrams.add(query.slice(i, i + 3))
    }

    let results = cloneList.map((el, index) => {
      let str = el.toLowerCase().replace(/\s+/g, "")

      let trigrams = new Set()
      for (let j = 0; j < str.length - 2; j++) {
        trigrams.add(str.slice(j, j + 3))
      }

      let intersection = 0
      for (let tri of trigrams) {
        if (inputTrigrams.has(tri)) intersection++
      }

      let score = intersection / Math.max(trigrams.size, inputTrigrams.size || 1)

      return {
        value: inputList[index],
        score,
      }
    })

    results.sort((a, b) => b.score - a.score)

    let finalResults = results
      .filter((r) => r.score >= minScore)
      .slice(0, top)
      .map((r) => r.value)

    bridge.store(values.result, finalResults)
  },
}
