/*
  Check Gift Key And Use mod by candiedapple
  Licensed under MIT License

  Lets you use gift keys and check if they are valid.
*/
module.exports = {
  data: {
    name: "Check Gift Key And Use",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  category: "Gift Keys",
  UI: [
    {
      element: "input",
      name: "Gift Key to Use",
      storeAs: "giftKeyToUse",
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If The Key's Valid, Run",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If The Key's Invalid, Run",
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
    } catch (error) {
      // If the file doesn't exist or is not valid JSON, start with an empty object
      existingData = { keys: [], usedkeys: [] };
    }

    const { keys: existingKeys, usedkeys: existingUsedKeys } = existingData;

    // Check if the provided gift key exists in the 'keys' section
    const index = existingKeys.indexOf(bridge.transf(values.giftKeyToUse));

    if (index !== -1) {
      // Move the gift key from 'keys' to 'usedkeys'
      const usedKey = existingKeys.splice(index, 1)[0];
      existingUsedKeys.push(usedKey);

      // Save updated keys to the JSON file
      const jsonData = { keys: existingKeys, usedkeys: existingUsedKeys };
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

      await bridge.call(values.true, values.trueActions);
    } else {
      await bridge.call(values.false, values.falseActions);
    }
  },
};
