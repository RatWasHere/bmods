modVersion = "v1.0";

module.exports = {
  data: {
    name: "Get Color Name",
  },
  category: "Colors",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  modules: ["color-name-list", "nearest-color"],
  UI: [
    {
      element: "input",
      name: "Hex",
      storeAs: "hex",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (data, constants) => {
    return `Color: ${data.hex}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const colorNameList = await client
      .getMods()
      .require("color-name-list", "10.28.1");

    // Get the nearest color from an extra list of colors
    const extraColors = colorNameList.reduce(
      (o, { name, hex }) => Object.assign(o, { [name.toLowerCase()]: hex }),
      {}
    );

    let nearestColor = await client.getMods().require("nearest-color");

    nearestColor = nearestColor.from(extraColors);

    const hexColor = bridge.transf(values.hex);

    const name = nearestColor(hexColor).name;

    return bridge.store(values.store, name);
  },
};
