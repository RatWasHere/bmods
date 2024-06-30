module.exports = {
  data: { name: "Create Self-Contained Anchor", id: new Date().getTime() },
  category: "Anchors",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat",
  },
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Anchor ID",
    },
    "-",
    {
      element: "actions",
      storeAs: "actions",
      name: "Actions",
    },
  ],
  init: (data, bridge) => {
    bridge.createGlobal({
      class: "anchors",
      name: data.id,
      value: data.actions,
    });
  },
  subtitle: "ID: $[id]$",
  async run(values, message, client, bridge) {},
};
