/*
  Generate Gift Keys mod by candiedapple
  Licensed under MIT License

  Lets you generate gift keys.
*/

function generateGiftKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let key = "";
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }
  return key;
}

module.exports = {
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  category: "Gift Keys",
  data: {
    name: "Generate Gift Keys",
  },
  UI: [
    {
      element: "input",
      name: "Number of Keys",
      storeAs: "numKeys",
    },
    "-",
    {
      element: "store",
      storeAs: "generatedkeys",
      name: "Store Generated Keys As",
    },
  ],
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(__dirname, "..", "giftkeys.json");

    // Read existing keys from the file
    let existingData;
    try {
      const existingContent = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(existingContent);

      // Ensure 'usedkeys' is initialized as an array
      if (!existingData.usedkeys || !Array.isArray(existingData.usedkeys)) {
        existingData.usedkeys = [];
      }
    } catch (error) {
      // If the file doesn't exist or is not valid JSON, start with an empty object
      existingData = { keys: [], usedkeys: [] };
    }

    const { keys: existingKeys, usedkeys: existingUsedKeys } = existingData;

    // Generate new keys
    const newKeys = [];
    for (let i = 0; i < bridge.transf(values.numKeys); i++) {
      const giftKey = generateGiftKey();
      newKeys.push(giftKey);
    }

    bridge.store(values.generatedkeys, newKeys.join("\n"));

    // Merge existing keys with new keys
    const allKeys = [...existingKeys, ...newKeys];

    const jsonData = { keys: allKeys, usedkeys: existingUsedKeys };

    // Save merged keys to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  },
};
