modVersion = "v1.1.0";
module.exports = {
  data: {
    name: "Censorly AI",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
    description: "Use an AI to check the text for bad words.",
  },
  category: "AI",
  UI: [
    {
      element: "largeInput",
      storeAs: "text",
      name: "Text",
    },
    "-",
    {
      element: "input",
      storeAs: "key",
      name: "API Key",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "flagged",
      name: "The status of the text for bad words.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "topics",
      name: "Array of main topics identified in the text.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "confidence",
      name: "Number from 0 to 1.0 indicating AI's certainty.",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "language",
      name: "Two-letter language code (e.g., en, es) or Unknown.",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  async run(values, interaction, client, bridge) {

      const text = bridge.transf(values.text);
      const apikey = bridge.transf(values.key);

      try {
          const response = await fetch("https://jwwodttgkwgvpnpxvgca.supabase.co/functions/v1/analyze-message ", {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${apikey}`,
                  "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                  text
              })
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          bridge.store(values.flagged, result?.flagged);
          bridge.store(values.topics, result?.topics);
          bridge.store(values.confidence, result?.confidence);
          bridge.store(values.language, result?.language);

      } catch (error) {
          console.error('Error analyzing text:', error.message);
      }

  },
};