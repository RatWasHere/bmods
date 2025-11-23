modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Filter List",
  },
  aliases: [],
  modules: [],
  category: "Lists",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "list",
      name: "List",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "filterType",
      name: "Filter Type",
      choices: {
        for: { name: "Filter For Elements", field: false },
        out: { name: "Filter Out Elements", field: false },
      },
    },
    {
      element: "typedDropdown",
      storeAs: "filter",
      name: "Filter For Elements That",
      choices: {
        startsWith: { name: "Starts With", field: true },
        endsWith: { name: "Ends With", field: true },
        includes: { name: "Includes", field: true },
        equals: { name: "Equals", field: true },
        strings: { name: "Are Strings", field: false },
        numbers: { name: "Are Numbers", field: false },
      },
    },
    "_",
    {
      element: "toggle",
      storeAs: "caseSens",
      name: "Case Sensitive",
    },
    "-",
    {
      element: "store",
      storeAs: "modifiedList",
      name: "Store Filtered List As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let filterType = values.filterType.type === "for" ? "For" : "Out"
    let filter = values.filter.type
    let filterValue = values.filter.value

    let phrases = {
      startsWith: `Starts With ${filterValue}`,
      endsWith: `Ends With ${filterValue}`,
      includes: `Includes ${filterValue}`,
      equals: `Equals ${filterValue}`,
      strings: `Are Strings`,
      numbers: `Are Numbers`,
    }

    let subtitle = `Filter ${filterType} Elements That ${phrases[filter]} From List ${values.list.type}(${values.list.value})`

    return subtitle
  },

  script: (values) => {
    function reflem(skipAnimation) {
      let filterType = values.data.filterType.type

      switch (filterType) {
        case "for": {
          values.UI[3].name = "Filter For Elements That"
          break
        }

        case "out": {
          values.UI[3].name = "Filter Out Elements That"
          break
        }
      }

      setTimeout(
        () => {
          values.updateUI()
        },
        skipAnimation ? 1 : values.commonAnimation * 100
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

    let list = bridge.get(values.list)

    let filterType = bridge.transf(values.filterType.type)
    let filter = bridge.transf(values.filter.type)
    let filterValue = bridge.transf(values.filter.value)
    let caseSens = values.caseSens

    const normalize = (el) => (typeof el === "string" && caseSens === false ? el.toLowerCase() : el)

    let testFunction

    switch (filter) {
      case "startsWith": {
        testFunction = (el) => normalize(el).startsWith(normalize(filterValue))
        break
      }

      case "endsWith": {
        testFunction = (el) => normalize(el).endsWith(normalize(filterValue))
        break
      }

      case "includes": {
        testFunction = (el) => normalize(el).includes(normalize(filterValue))
        break
      }

      case "equals": {
        testFunction = (el) => normalize(el) == normalize(filterValue)
        break
      }

      case "strings": {
        testFunction = (el) => typeof el === "string" && isNaN(Number(el))
        break
      }

      case "numbers": {
        testFunction = (el) => {
          if (typeof el === "number" && !isNaN(el)) {
            return true
          } else if (typeof el === "string" && el.trim() !== "" && !isNaN(Number(el))) {
            return true
          } else {
            return false
          }
        }
        break
      }
    }

    let filteredList = list.filter((el) => {
      let matchResult = testFunction(el)
      return filterType === "for" ? matchResult : !matchResult
    })

    bridge.store(values.modifiedList, filteredList)
  },
}
