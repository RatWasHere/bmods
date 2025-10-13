/*
  Ask Gemini mod by qschnitzel
  Licensed under MIT License

  Prompt Gemini AI and get a response.
*/
const fs = require("node:fs");
const path = require("node:path");
const { Readable } = require("node:stream");
const { finished } = require("node:stream/promises");
const { randomUUID } = require("node:crypto");
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
  modules: ["@google/genai"],
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
      storeAs: "mediaUrl",
      name: "Media URL (Optional)",
    },
    "-",
    {
      element: "input",
      storeAs: "mediaType",
      name: "Media Type (Needed if Media URL is used)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store response",
    },
  ],

  async run(values, interaction, client, bridge) {
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName);
    }

    const {
      GoogleGenAI,
      createUserContent,
      createPartFromUri,
    } = require("@google/genai");

    const apiKey = bridge.transf(values.apiKey);
    const model = bridge.transf(values.model) || "gemini-pro";
    const prompt = bridge.transf(values.prompt);
    const mediaUrl = bridge.transf(values.mediaUrl);
    const mediaType = bridge.transf(values.mediaType);

    const ai = new GoogleGenAI({ apiKey: apiKey });

    let file = null;
    if (mediaUrl) {
      const geminiDir = path.join(__dirname, "..", "gemini");

      if (!fs.existsSync(geminiDir)) {
        fs.mkdirSync(geminiDir, { recursive: true });
      }

      const localFilePath = path.join(
        geminiDir,
        randomUUID() + "." + mediaUrl.split(".").pop().split(/\#|\?/)[0]
      );

      const stream = fs.createWriteStream(localFilePath);
      const img = await fetch(mediaUrl);
      await finished(Readable.fromWeb(img.body).pipe(stream));

      file = await ai.files.upload({
        file: localFilePath,
        config: {
          mimeType: mediaType,
        },
      });
    }

    if (!file) {
      var response = await ai.models.generateContent({
        model: model,
        contents: [createUserContent([prompt])],
      });
    } else {
      var response = await ai.models.generateContent({
        model: model,
        contents: [
          createUserContent([
            prompt,
            createPartFromUri(file.uri, file.mimeType),
          ]),
        ],
      });
    }

    if (!response.candidates || !response.candidates[0]) {
      console.error(
        "Gemini API Error:",
        response.status,
        response.statusText,
        response
      );
      return bridge.store(values.store, "Error fetching Gemini response.");
    }

    bridge.store(values.store, response.candidates[0].content.parts[0].text);
  },
};
