const crypto = require('node:crypto');
hashingAlgorithms = crypto.getHashes();

module.exports = {
  data: {
    name: "HashDrop",
    algorithm: "sha256"
  },
  info: {
    source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia"
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
        hashingAlgorithms.forEach(algorithm => {
          dropdownOptions.push({name: `${algorithm}`, field: false})
        });
        return dropdownOptions
      })()
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Hashed String As"
    },
  ],
  
  subtitle: (values) => {
    return `Hash text with ${values.algorithm} algorithm`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let oriText = bridge.transf(values.toHash)
    let hashAlgorithm = bridge.transf(values.algorithm)
    
    hashedTxt = crypto.createHash(hashAlgorithm).update(oriText).digest('hex');
    bridge.store(values.store, hashedTxt);
  }
}