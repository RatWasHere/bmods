modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Find Data Element By Attribute",
  },
  aliases: [],
  modules: [],
  category: "Data",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputData",
      name: "Data",
    },
    {
      element: "input",
      storeAs: "elementAccessor",
      name: "path.to.parentElement (optional)",
    },
    "-",
    {
      element: "input",
      storeAs: "attributeKey",
      name: "Attribute",
    },
    {
      element: "input",
      storeAs: "attributeValue",
      name: "Must Equal",
    },
    "-",
    {
      element: "store",
      storeAs: "foundElement",
      name: "Store Data Element As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    let phraseMap = {
      equals: "Equals",
      equalsExact: "Equals Exactly",
      notEquals: "Doesn't Equal",
      exists: "Exists",
      lessThan: "Less Than",
      greaterThan: "Greater Than",
      equalOrLessThan: "Equal Or Less Than",
      equalOrGreaterThan: "Equal Or Greater Than",
      isNumber: "Is Number",
      matchesRegex: "Matches Regex",
    }
    return `Find Data Element Where Attribute [${values.attributeKey}] Equals ${values.attributeValue}`
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

    let inputData = bridge.get(values.inputData)
    if (isJSON(inputData) == false) {
      console.error(`The Input Data Is Malformed`)
      return
    }

    let dataElement = inputData
    if (values.elementAccessor) {
      let parentPath = bridge.transf(values.elementAccessor).trim()
      parentPath = parentPath.replaceAll("..", ".")
      if (parentPath.startsWith(".")) {
        parentPath = parentPath.slice(1)
      }

      if (parentPath === "" || parentPath.includes("..") || parentPath.startsWith(".") || parentPath.endsWith(".")) {
        console.error(`Invalid Path: ${values.elementAccessor}`)
        return
      }

      try {
        const keys = parentPath
          .replace(/\[(\d+)\]/g, `.$1`)
          .split(`.`)
          .filter(Boolean)

        for (let key of keys) {
          if (dataElement && Object.prototype.hasOwnProperty.call(dataElement, key)) {
            dataElement = dataElement[key]
          } else {
            dataElement = undefined
          }
        }
      } catch {
        console.error(`Failed To Parse Path "${values.elementAccessor}"`)
        return
      }
    }

    if (dataElement == undefined) {
      console.error(`The Element ${values.elementAccessor} Is Undefined`)
      return
    }

    let attributeKey = bridge.transf(values.attributeKey).trim()
    attributeKey = attributeKey.replaceAll("..", ".")
    if (attributeKey.startsWith(".")) {
      attributeKey = attributeKey.slice(1)
    }

    let attributeValue = bridge.transf(values.attributeValue).trim()

    let foundElement = undefined

    if (typeof dataElement !== "object" || Array.isArray(dataElement) || dataElement === null) {
      console.error(`Target At "${values.elementAccessor || "Root"}" Is Not A JSON Object`)
      return
    }

    for (const key in dataElement) {
      if (!Object.prototype.hasOwnProperty.call(dataElement, key)) continue
      const element = dataElement[key]

      if (element && typeof element === "object") {
        let current = element
        const pathParts = attributeKey.split(".").filter(Boolean)

        for (let i = 0; i < pathParts.length; i++) {
          const p = pathParts[i]

          if (current != null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, p)) {
            current = current[p]
          } else {
            current = undefined
            break
          }
        }

        if (current == attributeValue) {
          foundElement = element
          break
        }
      }
    }

    bridge.store(values.foundElement, foundElement)
  },
}
