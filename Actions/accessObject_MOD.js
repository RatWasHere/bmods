modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Access JSON Object"
  },
  aliases: ["Access Object"],
  modules: [],
  category: "JSON",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "original",
      name: "JSON",
    },
    {
      element: "menu",
      storeAs: "paths",
      name: "Access Paths",
      types: {
        paths: "paths"
      },
      max: 1000,
      UItypes: {
        paths: {
          data: {},
          name: "Path",
          preview: "`${option.data.elementPath}`",
          UI: [
            {
              element: "input",
              storeAs: "elementPath",
              name: "Path To Element",
              placeholder: "path.to.element"
            },
            {
              element: "store",
              storeAs: "store",
              name: "Store Element As",
            },
          ]
        }
      }
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Access ${values.paths.length} Elements From JSON Object ${values.original.type}(${values.original.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    let original = bridge.get(values.original)

    function isJSON(testObject){
      return (testObject != undefined && typeof testObject === "object" && testObject.constructor === Object)
    }

    if (isJSON(original) !== true){
      console.error(`Value ${original} Is Not A Valid JSON`)
      return
    }

    for (let path of values.paths){
      let pathData = path.data

      let objectPath = bridge.transf(pathData.elementPath).trim()

      objectPath = objectPath.replaceAll("..", ".")
      if (objectPath.startsWith(".")) {
        objectPath = objectPath.slice(1)
      }

      if (
        objectPath === "" ||
        objectPath.includes("..") ||
        objectPath.startsWith(".") ||
        objectPath.endsWith(".")
      ){
        console.error(`Invalid path: "${objectPath}"`)
        continue
      }

      let keys = objectPath.split(".")
      let lastKey = keys.pop()
      let target = original

      for (const key of keys){
        if (typeof target[key] !== "object" || target[key] === null){
          target[key] = {}
        }
        target = target[key]
      }

      bridge.store(pathData.store, target[lastKey])
    }
  }
}