modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "MongoDB Get Collection Info",
  },
  aliases: [],
  modules: ["mongodb"],
  category: "MongoDB",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "mongoClient",
      name: "MongoDB Connection",
    },
    {
      element: "inputGroup",
      storeAs: ["database", "collection"],
      nameSchemes: ["Database", "Collection"],
    },
    "-",
    {
      element: "menu",
      storeAs: "infos",
      name: "Infos",
      types: { info: "info" },
      max: 1000,
      UItypes: {
        info: {
          data: {},
          name: "Info",
          preview: (option) => {
            console.log(option)
            let phraseMap = {
              namespace: "Name Space",
              dbType: "Database Type",
              estimatedCount: "Estimated Document Count",
              exactCount: "Exact Document Count",
              dataSize: "Data Storage Used",
              avgObjectSize: "Average Document Size",
              storageSize: "Disk Allocation",
              indexSize: "Index Storage Used",
              indexes: "Indexes",
              isCapped: "Is Capped",
              validationLevel: "Validation Level",
            }

            return "`phraseMap[${option.data.info.type}]`"
          },
          UI: [
            {
              element: "typedDropdown",
              storeAs: "info",
              name: "Info",
              choices: {
                namespace: { name: "Name Space" },
                dbType: { name: "Database Type" },
                estimatedCount: { name: "Estimated Document Count" },
                exactCount: { name: "Exact Document Count" },
                dataSize: { name: "Data Storage Used" },
                avgObjectSize: { name: "Average Document Size" },
                storageSize: { name: "Disk Allocation" },
                indexSize: { name: "Index Storage Used" },
                indexes: { name: "Indexes" },
                isCapped: { name: "Is Capped" },
                validationLevel: { name: "Validation Level" },
              },
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store As",
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

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Get ${values.infos.length} Informations In MongoDB [${values.database}:${values.collection}]`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    const mongodb = require("mongodb")
    const mongoClient = bridge.get(values.mongoClient)
    let databaseName = null
    let collectionName = bridge.transf(values.collection).trim()
    if (!collectionName || !mongoClient) {
      return console.log(`[${this.data.name}] A MongoDB Connection & A Collection Is Needed`)
    }
    if (values.database) {
      databaseName = bridge.transf(values.database).trim()
    }
    let database = mongoClient.db(databaseName)
    let collection = database.collection(collectionName)

    let options = await collection.options()
    let stats = await collection.stats()
    let indexes = await collection.indexes()
    let estimatedCount = await collection.estimatedDocumentCount()
    let exactCount = await collection.countDocuments({})

    for (let get of values.infos) {
      let getData = get.data
      let infoType = getData.info.type

      switch (infoType) {
        case "namespace": {
          bridge.store(getData.store, `${databaseName}.${collectionName}`)
          break
        }
        case "dbType": {
          let dbType = options.timeseries ? "timeseries" : options.capped ? "capped" : "standard"
          bridge.store(getData.store, dbType)
          break
        }
        case "estimatedCount": {
          bridge.store(getData.store, estimatedCount)
          break
        }
        case "exactCount": {
          bridge.store(getData.store, exactCount)
          break
        }
        case "dataSize": {
          bridge.store(getData.store, stats.size)
          break
        }
        case "avgObjectSize": {
          bridge.store(getData.store, stats.avgObjSize)
          break
        }
        case "storageSize": {
          bridge.store(getData.store, stats.storageSize)
          break
        }
        case "indexSize": {
          bridge.store(getData.store, stats.totalIndexSize)
          break
        }
        case "indexes": {
          bridge.store(getData.store, indexes)
          break
        }
        case "isCapped": {
          bridge.store(getData.store, options.capped)
          break
        }
        case "validationLevel": {
          bridge.store(getData.store, options.validationLevel)
          break
        }
      }
    }
  },
}
