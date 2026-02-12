module.exports = {
  category: "Messages",
  data: {
    name: "Publish Announcement Message"
  },
  info: {
    creator: "fusionist__",
  },
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Message"
    },
    "-",
    {
      element: "storage",
      storeAs: "store",
      name: "Store Published Message As",
      optional: true
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `${constants.message(values.message)}`
  },

  async run(values, msg, client, bridge) {
    const message = await bridge.getMessage(values.message);
    if (!message) return;

    try {
      const publishedMessage = await message.crosspost();
      if (values.store && values.store.type != "none") {
        bridge.store(values.store, publishedMessage ?? message);
      }
    } catch {
    }
  },
};
