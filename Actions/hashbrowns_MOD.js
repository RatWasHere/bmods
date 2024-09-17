const crypto = require('node:crypto');
acpthashes = crypto.getHashes().toString(`, `);

module.exports = {
  data: {
    name: "Hash"
  },
  info: {
    source: "https://github.com/slothyace/BCS/blob/main/Mods",
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
      element: "input",
      storeAs: "algorithm",
      name: "Hashing Algorithm",
      placeholder: "If left empty, SHA256 will be used."
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Hashed String As"
    },
    "-",
    {
      element: "text",
      text: `Supported algorithms: ${acpthashes}`,
    }
  ],
  
  subtitle: (values) => {
    let algorythm = values.algorithm || `SHA256`;
    return `Hash text with ${algorythm} algorithm`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let oriText = bridge.transf(values.toHash);
    let hashAlgorithm = bridge.transf(values.algorithm) || `SHA256`;
    
    hashedTxt = crypto.createHash(hashAlgorithm).update(oriText).digest('hex');
    bridge.store(values.store, hashedTxt);
  }
}