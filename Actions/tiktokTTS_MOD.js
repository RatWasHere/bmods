/*
  Tiktok Text to Speech mod by qschnitzel
  Licensed under MIT License

  Create Text-To-Speech audio files using Tiktok's TTS.
  Why? Because its free ¯\_(ツ)_/¯
*/
const fs = require("fs");

module.exports = {
  data: {
    name: "Tiktok TTS",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "AI",
  UI: [
    {
      element: "dropdown",
      name: "Voice",
      choices: [
        {
          name: "en_us_001",
        },
        {
          name: "en_us_006",
        },
        {
          name: "en_us_007",
        },
        {
          name: "en_us_009",
        },
        {
          name: "en_us_010",
        },
        {
          name: "en_uk_001",
        },
        {
          name: "en_uk_003",
        },
        {
          name: "en_au_001",
        },
        {
          name: "en_au_002",
        },
        {
          name: "fr_001",
        },
        {
          name: "fr_002",
        },
        {
          name: "de_001",
        },
        {
          name: "de_002",
        },
        {
          name: "es_002",
        },
        {
          name: "es_mx_002",
        },
        {
          name: "es_male_m3",
        },
        {
          name: "es_female_f6",
        },
        {
          name: "es_female_fp1",
        },
        {
          name: "es_mx_female_supermom",
        },
        {
          name: "br_003",
        },
        {
          name: "br_004",
        },
        {
          name: "br_005",
        },
        {
          name: "id_001",
        },
        {
          name: "jp_001",
        },
        {
          name: "jp_003",
        },
        {
          name: "jp_005",
        },
        {
          name: "jp_006",
        },
        {
          name: "kr_002",
        },
        {
          name: "kr_004",
        },
        {
          name: "kr_003",
        },
        {
          name: "en_us_ghostface",
        },
        {
          name: "en_us_chewbacca",
        },
        {
          name: "en_us_c3po",
        },
        {
          name: "en_us_stitch",
        },
        {
          name: "en_us_stormtrooper",
        },
        {
          name: "en_us_rocket",
        },
        {
          name: "en_female_f08_salut_damour",
        },
        {
          name: "en_male_m03_lobby",
        },
        {
          name: "en_male_m03_sunshine_soon",
        },
        {
          name: "en_female_f08_warmy_breeze",
        },
        {
          name: "en_female_ht_f08_glorious",
        },
        {
          name: "en_male_sing_funny_it_goes_up",
        },
        {
          name: "en_male_m2_xhxs_m03_silly",
        },
        {
          name: "en_female_ht_f08_wonderful_world",
        },
        {
          name: "Variable",
          field: true,
        },
      ],
      storeAs: "voice",
      extraField: "voice",
    },
    "-",
    {
      element: "input",
      storeAs: "text",
      name: "Text to Speech",
    },
    "-",
    {
      element: "input",
      storeAs: "directory",
      name: "Save file as",
    },
  ],

  async run(values, interaction, client, bridge) {
    const text = bridge.transf(values.text);
    const voice = bridge.transf(values.voice);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"text":"${text}", "voice":"${voice}"}`,
    };

    const response = await fetch(
      `https://tiktok-tts.weilnet.workers.dev/api/generation`,
      options
    );

    const jsonResponse = await response.json();
    const audio = Buffer.from(jsonResponse.data, "base64");

    fs.writeFileSync(bridge.file(values.directory), audio);
  },
};
