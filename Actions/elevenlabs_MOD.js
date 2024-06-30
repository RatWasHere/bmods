/*
  Elevenlabs mod by qschnitzel, splatchoot
  Licensed under MIT License

  Create Text-To-Speech audio files using Elevenlabs API.
*/
const fs = require("fs").promises;

module.exports = {
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel, splatchoot",
  },
  category: "AI",
  data: {
    name: "Elevenlabs",
  },
  UI: [
    {
      element: "input",
      storeAs: "api_key",
      name: "API Key",
    },
    "-",
    {
      element: "input",
      storeAs: "voice_id",
      name: "Voice ID",
    },
    "-",
    {
      element: "input",
      storeAs: "text",
      name: "Text To Speech",
    },
    {
      element: "input",
      storeAs: "directory",
      name: "Save File To",
    },
  ],

  async run(values, interaction, client, bridge) {
    const text = bridge.transf(values.text);
    const voice_id = bridge.transf(values.voice_id);
    const key = bridge.transf(values.api_key);

    const options = {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": key,
      },
      body: `{"text":"${text}"}`,
    };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      options
    );

    const buffer = await streamToBuffer(response.body);

    await fs.writeFile(bridge.file(values.directory), buffer);
  },
};

// idk never worked with buffers and such, so thats from ChatGPT ggwp
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  if (stream.body) {
    stream.body = streamToBuffer(stream.body);
  }

  return Buffer.concat(chunks);
}
