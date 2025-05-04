/*
  Ask Gemini mod by qschnitzel
  Licensed under MIT License

  Prompt Gemini AI and get a response.
*/

module.exports = {
  data: {
    name: "Ask Gemini",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    description:
      "Use Google Gemini AI to generate a response based on a prompt.",
  },
  category: "AI",
  UI: [
    {
      element: "input",
      storeAs: "apiKey",
      name: "Gemini API Key",
    },
    "-",
    {
      element: "input",
      storeAs: "model",
      name: "Model (e.g., gemini-pro)",
    },
    "-",
    {
      element: "input",
      storeAs: "prompt",
      name: "User Prompt",
    },
    "-",
    {
      element: "input",
      storeAs: "systemPrompt",
      name: "System Instruction (Optional)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store response",
    },
  ],

  async run(values, interaction, client, bridge) {
    const apiKey = bridge.transf(values.apiKey);
    const model = bridge.transf(values.model) || "gemini-pro";
    const prompt = bridge.transf(values.prompt);
    const systemPrompt = bridge.transf(values.systemPrompt);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: {
          parts: [
            {
              text: systemPrompt || "You are a helpful assistant.",
            },
            {
              text: prompt,
            },
          ],
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.candidates || !result.candidates[0]) {
      console.error(
        "Gemini API Error:",
        response.status,
        response.statusText,
        result
      );
      return bridge.store(
        values.store,
        "Error fetching Gemini response. Check your API key and prompt."
      );
    }

    const reply =
      result.candidates[0].content?.parts?.[0]?.text ||
      "No response from Gemini.";

    bridge.store(values.store, reply);
  },
};
