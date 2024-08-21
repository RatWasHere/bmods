/*
  Profanity API mod by qschnitzel
  Licensed under MIT License

  API Wrapper for https://www.profanity.dev/
  aka. a toxic content detector
*/

module.exports = {
  data: {
    name: "Profanity API",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "Text",
  UI: [
    {
      element: "input",
      storeAs: "text",
      name: "Input to check",
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True, Run",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False, Run",
    },
  ],

  async run(values, interaction, client, bridge) {
    const message = bridge.transf(values.text);

    fetch("https://vector.profanity.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }).then(async (res) => {
      const response = await res.json();
      if (response.isProfanity) {
        await bridge.call(values.true, values.trueActions);
      } else {
        await bridge.call(values.false, values.falseActions);
      }
    });
  },
};
