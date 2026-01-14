modVersion = "v1.0.1"
module.exports = {
  data: {
    name: "Find Data Element By Multiple Attributes",
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
      element: "menu",
      storeAs: "attributes",
      name: "List Of Attributes",
      types: { attribute: "attribute" },
      max: 1000,
      UItypes: {
        attribute: {
          data: {},
          name: "Attribute",
          preview: "`${option.data.attributeKey}: ${option.data.attributeValue}`",
          UI: [
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
          ],
        },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "elementIden",
      name: "Store Data Element Identifier As",
    },
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
    return `Find Data Element Where ${values.attributes.length} Attributes Must Match`
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
      console.error(`[${this.data.name}] The Input Data Is Malformed`)
      return
    }

    let dataElement = inputData
    if (values.elementAccessor) {
      let parentPath = bridge.transf(values.elementAccessor).trim()
      parentPath = parentPath.replaceAll(/\.{2,}/g, ".")
      if (parentPath.startsWith(".")) {
        parentPath = parentPath.slice(1)
      }

      if (parentPath === "" || parentPath.startsWith(".") || parentPath.endsWith(".")) {
        console.error(`[${this.data.name}] Invalid Path: ${values.elementAccessor}`)
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
        console.error(`[${this.data.name}] Failed To Parse Path "${values.elementAccessor}"`)
        return
      }
    }

    if (dataElement == undefined) {
      console.error(`[${this.data.name}] The Element ${values.elementAccessor} Is Undefined`)
      return
    }

    let elementIden = undefined
    let foundElement = undefined

    if (typeof dataElement !== "object" || Array.isArray(dataElement) || dataElement === null) {
      console.error(`[${this.data.name}] Target At "${values.elementAccessor || "Root"}" Is Not A JSON Object`)
      return
    }

    let attributeKeyVals = []
    for (let attribute of values.attributes) {
      let key = bridge.transf(attribute.data.attributeKey).trim()
      let value = bridge.transf(attribute.data.attributeValue).trim()
      if (key) {
        attributeKeyVals.push({ key, value })
      }
    }

    for (const id in dataElement) {
      if (!Object.prototype.hasOwnProperty.call(dataElement, id)) continue
      const element = dataElement[id]
      if (!element || typeof element !== "object") continue

      let matchesAll = true

      for (const { key, value } of attributeKeyVals) {
        const pathParts = key.split(".").filter(Boolean)
        let current = element

        for (const p of pathParts) {
          if (current && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, p)) {
            current = current[p]
          } else {
            current = undefined
            break
          }
        }

        if (current != value) {
          matchesAll = false
          break
        }
      }

      if (matchesAll) {
        foundElement = element
        elementIden = id
        break
      }
    }

    bridge.store(values.elementIden, elementIden)
    bridge.store(values.foundElement, foundElement)
  },
}
