module.exports = {
  data: {
    name: "Get Regex Match List",
  },
  category: "Variables",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "text",
    },
    "-",
    {
      element: "input",
      name: "Regex Pattern - Use double backslashes (\\\\) for escaping",
      storeAs: "regexpattern",
    },
    "-",
    {
      element: "input",
      name: "Flags - Global (g), Ignore Case (i), Multiline (m), Single Line (s), Unicode (u), Sticky (y)",
      placeholder: "gimsuy",
      storeAs: "flags",
    },
    "-",
    {
      element: "toggle",
      storeAs: "duplication",
      name: "Allow Duplications",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Matched List As",
      storeAs: "store",
    },
  ],
  async run(values, message, client, bridge) {
    const text = bridge.transf(values.text);
    const flags = bridge.transf(values.flags);
    const allowDuplicates = bridge.transf(values.duplication) === 'true'; // Ensure it's a boolean

    // Ensure the pattern has the global flag
    const pattern = new RegExp(bridge.transf(values.regexpattern), flags);

    const matches = [...text.matchAll(pattern)];
    const results = [];

    for (const match of matches) {
      const resElement = match[0];
      if (allowDuplicates || !results.includes(resElement)) {
        results.push(resElement);
      }
    }

    bridge.store(values.store, results);
  },
};