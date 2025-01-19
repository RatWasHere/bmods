module.exports = {
  category: "Bot",
  data: {
    name: "Check If User Is Bot Owner",
  },
  UI: [
    {
      element: "userInput",
      storeAs: "user",
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If User Is Bot Owner",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If User Isn't Bot Owner",
    },
  ],
  subtitle: "",
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const user = await bridge.getUser(values.user);
    let output = false;

    try {
      const application = await client.rest.applications.getCurrent();
      if (application.owner.id === user.id) {
        output = true;
      }
    } catch (err) {}

    if (output) {
      await bridge.call(values.true, values.trueActions);
    } else {
      await bridge.call(values.false, values.falseActions);
    }
  },
};
