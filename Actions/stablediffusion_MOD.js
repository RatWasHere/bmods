/*
  Stable Diffusion mod by qschnitzel
  Licensed under MIT License

  Generate images from text using Stable Diffusion.
*/

// Good negative prompt: ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck)))

const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");

module.exports = {
  data: {
    name: "Stable Diffusion",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "Images",
  UI: [
    {
      element: "input",
      storeAs: "prompt",
      name: "Prompt",
    },
    "-",
    {
      element: "input",
      storeAs: "negative_prompt",
      name: "Negative Prompt",
    },
    "-",
    {
      element: "input",
      storeAs: "steps",
      name: "Steps",
    },
    "-",
    {
      element: "input",
      storeAs: "width",
      name: "Width",
    },
    "-",
    {
      element: "input",
      storeAs: "height",
      name: "Height",
    },
    "-",
    {
      element: "input",
      storeAs: "cfg_scale",
      name: "CFG Scale",
    },
    "-",
    {
      element: "input",
      storeAs: "seed",
      name: "Seed",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store path of generated image",
    },
  ],

  async run(values, interaction, client, bridge) {
    const data = {
      prompt: bridge.transf(values.prompt),
      negative_prompt: bridge.transf(values.negative_prompt),
      steps: +bridge.transf(values.steps),
      width: +bridge.transf(values.width),
      height: +bridge.transf(values.height),
      cfg_scale: +bridge.transf(values.cfg_scale),
      seed: +bridge.transf(values.seed),
    };
    const generated = await txt2img(data);
    const file_name = bridge
      .transf(values.prompt)
      .toLowerCase()
      .replaceAll(" ", "-");
    fs.writeFileSync(
      path.join(__dirname, "..", "LICENSES", file_name + ".jpg"),
      generated
    );

    bridge.store(values.store, "AppData/LICENSES/" + file_name + ".jpg");
  },
};

async function txt2img(data) {
  const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const formatted_response = await response.json();
  const buffer = Buffer.from(formatted_response.images[0], "base64");

  return buffer;
}
