module.exports = {
  data: {
    name: "Get HTML From Webpage",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat",
  },
  category: "WebAPIs",
  UI: [
    {
      element: "input",
      name: "Webpage URL",
      storeAs: "url",
    },
    "-",
    {
      element: "largeInput",
      name: "Headers",
      placeholder: "User-Agent: Other \nKey: Value - One Per Line",
      storeAs: "headers",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result HTML As",
      storeAs: "store",
    },
  ],
  category: "WebAPIs",
  subtitle: "Store HTML: $[url]$",
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const url = bridge.transf(values.url);
    const headers = bridge.transf(values.headers);

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const setHeaders = {
      "User-Agent": "Other",
    };

    if (headers) {
      const lines = String(headers).split("\n");
      for (let i = 0; i < lines.length; i++) {
        const header = lines[i].split(":");
        if (lines[i].includes(":") && header.length > 0) {
          const key = header[0].trim();
          const value = header[1].trim();
          setHeaders[key] = value;
        } else {
          console.error(
            `WebAPI: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`
          );
        }
      }
    }

    const res = await fetch(url, { headers: setHeaders });
    const htmlContent = await res.text();
    bridge.store(values.store, htmlContent);
  },
};
