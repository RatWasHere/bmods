/*
  Limit Text Length mod by qschnitzel
  Licensed under MIT License

  Limit the length of a text input to a specified number of characters.",
*/

module.exports = {
  data: {
    name: "Limit Text Length",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    description:
      "Limit the length of a text input to a specified number of characters.",
  },
  category: "Text",
  UI: [
    {
      element: "input",
      storeAs: "text",
      name: "Text",
    },
    "-",
    {
      element: "input",
      storeAs: "maxLength",
      name: "Limit Length",
      placeholder: "2000",
    },
    "-",
    {
      element: "input",
      storeAs: "exceededMessage",
      name: "Custom Message if Limit Exceeded (optional)",
      placeholder: "-# Exceeded the limit of 2000 characters",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "result",
      name: "Store Limited Text",
    },
  ],

  async run(values, interaction, client, bridge) {
    const text = bridge.transf(values.text);
    const maxLength = parseInt(values.maxLength) || 2000;
    const exceededMessage = bridge.transf(values.exceededMessage) ?? "";

    if (text.length <= maxLength) {
      bridge.store(values.result, text);
      return;
    }

    let result = String(text).slice(0, maxLength - exceededMessage.length ?? 0);
    result += exceededMessage;
    bridge.store(values.result, result);
  },
};
