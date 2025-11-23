let cryptoCache = require("node:crypto")
hashingAlgorithms = cryptoCache.getHashes()
modVersion = "v1.0.2"

module.exports = {
  data: {
    name: "Hash Text",
    algorithm: "sha256",
  },
  aliases: ["Encrypt Text"],
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Encrypt",
  modules: ["node:crypto"],
  UI: [
    {
      element: "largeInput",
      storeAs: "toHash",
      name: "Text",
    },
    {
      element: "dropdown",
      storeAs: "algorithm",
      name: "Hashing Algorithm",
      choices: (() => {
        let dropdownOptions = []
        hashingAlgorithms.forEach((algorithm) => {
          dropdownOptions.push({ name: `${algorithm}`, field: false })
        })
        return dropdownOptions
      })(),
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Hashed String As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values) => {
    return `Hash text with ${values.algorithm} algorithm`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }
    const crypto = require("node:crypto")
    let oriText = bridge.transf(values.toHash)
    let hashAlgorithm = bridge.transf(values.algorithm)

    hashedTxt = crypto.createHash(hashAlgorithm).update(oriText).digest("hex")
    bridge.store(values.store, hashedTxt)
  },
}
