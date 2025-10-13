/*
    SAM TTS mod by qschnitzel
    Licensed under MIT License

    Create Text-To-Speech audio with SAM TTS
*/
module.exports = {
  data: {
    name: "SAM TTS",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    description: "Create Text-To-Speech audio with SAM TTS",
  },
  category: "TTS",
  UI: [
    {
      element: "largeInput",
      storeAs: "text",
      name: "Text",
      max: 1000,
    },
    "-",
    {
      element: "input",
      storeAs: "pitch",
      name: "Pitch (0-255)",
      margin: "4px",
    },
    {
      element: "input",
      storeAs: "speed",
      name: "Speed (0-255)",
    },
    {
      element: "input",
      storeAs: "mouth",
      name: "Mouth (0-255)",
    },
    {
      element: "input",
      storeAs: "throat",
      name: "Throat (0-255)",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "buffer",
      name: "Store Audio Buffer",
    },
    {
      element: "html",
      html: "<p style='margin-left: 12px; margin-top: 12px;'>Use the buffer in an Attachment with the .wav extension as the Attachment Name.</p>",
    }
  ],
  subtitle: (values) => {
    return `Text: ${values.text || "None"}`;
  },
  async run(values, interaction, client, bridge) {
    const clamp = (num) => Math.max(0, Math.min(255, num));
    const text = bridge.transf(values.text);
    const pitch = clamp(+bridge.transf(values.pitch));
    const speed = clamp(+bridge.transf(values.speed));
    const mouth = clamp(+bridge.transf(values.mouth));
    const throat = clamp(+bridge.transf(values.throat));

    const response = await fetch(
      `https://sam.seofernando.com/speak?text=${encodeURIComponent(text)}&pitch=${pitch || 144}&speed=${speed || 144}&mouth=${mouth || 144}&throat=${throat || 144}`
    );

    const audioBuffer = await response.arrayBuffer();
    bridge.store(values.buffer, Buffer.from(audioBuffer));
  },
};