module.exports = {
  data: {
    name: "Get List Element Position",
  },
  category: "Lists",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "variableInsertion",
      storeAs: "list",
      name: "List",
    },
    {
      element: "input",
      storeAs: "elementname",
      name: "Element Name",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Element Position As",
    },
    "-",
    {
      element: "text",
      text: "Note : Positions start at 0",
    },
  ],

  async run(values, interaction, client, bridge) {
    const list = bridge.get(values.list);
    const elementName = bridge.transf(values.elementname);

    const elementPosition = list.indexOf(elementName);

    if (elementPosition === -1) {
      console.log(`The element "${elementName}" is not found in the list.`);
    }

    bridge.store(values.store, elementPosition);
  },
};
