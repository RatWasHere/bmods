/*
  Prodia mod by qschnitzel
  Licensed under MIT License

  Generate images using prodia.com
*/

module.exports = {
  data: {
    name: "Prodia",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "AI",
  UI: [
    {
      element: "input",
      storeAs: "key",
      name: "API Key",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "basemodel",
      name: "Base Model",
      choices: [{ name: "SD" }, { name: "SDXL" }],
    },
    "-",
    {
      element: "input",
      storeAs: "model",
      name: "Model",
    },
    "-",
    {
      element: "largeInput",
      storeAs: "prompt",
      name: "Prompt",
    },
    "-",
    {
      element: "largeInput",
      storeAs: "negative_prompt",
      placeholder:
        "lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature ",
      name: "Negative Prompt",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Image URL",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "style_preset",
      name: "Style Preset",
      choices: [
        { name: "None", default: true },
        { name: "3d-model" },
        { name: "analog-film" },
        { name: "anime" },
        { name: "cinematic" },
        { name: "comic-book" },
        { name: "digital-art" },
        { name: "enhance" },
        { name: "fantasy-art" },
        { name: "isometric" },
        { name: "line-art" },
        { name: "low-poly" },
        { name: "neon-punk" },
        { name: "origami" },
        { name: "photographic" },
        { name: "pixel-art" },
        { name: "texture" },
        { name: "craft-clay" },
      ],
    },
    {
      element: "input",
      storeAs: "steps",
      name: "Steps",
      placeholder: "20",
    },
    {
      element: "input",
      storeAs: "cfg_scale",
      name: "CFG Scale",
      placeholder: "7",
    },
    {
      element: "input",
      storeAs: "seed",
      name: "Seed",
      placeholder: "-1",
    },
    {
      element: "input",
      storeAs: "sampler",
      name: "Sampler",
      placeholder: "DPM++ 2M Karras",
    },
    {
      element: "input",
      storeAs: "width",
      name: "Width",
      placeholder: "512",
    },
    {
      element: "input",
      storeAs: "height",
      name: "Height",
      placeholder: "512",
    },
  ],

  async run(values, interaction, client, bridge) {
    const key = bridge.transf(values.key);
    const basemodel = bridge.transf(values.basemodel);

    const requestBody = {};

    const variables = {
      model: bridge.transf(values.model),
      prompt: bridge.transf(values.prompt),
      negative_prompt: bridge.transf(values.negative_prompt),
      style_preset:
        bridge.transf(values.style_preset) == "None"
          ? ""
          : bridge.transf(values.style_preset),
      steps: bridge.transf(values.steps),
      cfg_scale: bridge.transf(values.cfg_scale),
      seed: bridge.transf(values.seed),
      sampler: bridge.transf(values.sampler),
      width: bridge.transf(values.width),
      height: bridge.transf(values.height),
    };

    for (const [key, value] of Object.entries(variables)) {
      if (value !== "") {
        requestBody[key] = value;
      }
    }

    const generationURL = `https://api.prodia.com/v1/${basemodel.toLowerCase()}/generate`;
    const jobURL = "https://api.prodia.com/v1/job/";

    var requestJob = true;
    var imageURL = "";

    const sleep = require("util").promisify(setTimeout);

    await fetch(generationURL, {
      method: "POST",
      headers: {
        "X-Prodia-Key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then(async (res) => {
      if (!(+res.status == 200)) {
        return console.log(res.status, res.statusText);
      }

      const response = await res.json();
      while (requestJob) {
        await fetch(jobURL + response.job, {
          method: "GET",
          headers: {
            "X-Prodia-Key": key,
            Accept: "application/json",
          },
        }).then(async (jobRes) => {
          const jobReponse = await jobRes.json();
          if (jobReponse.status == "succeeded") {
            requestJob = false;
            imageURL = jobReponse.imageUrl;
          }
        });

        await sleep(750);
      }
    });

    bridge.store(values.store, imageURL);
  },
};
