module.exports = {
  data: {
    name: "Play Binary Variable",
  },
  modules: ["fs", "ffmpeg", "stream"],
  category: "Music",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "bufferVar",
      name: "Buffer Variable (Gotten From The File Output Of Download Music File)"
    },
    "-",
    {
      element: "dropdown",
      name: "Queuing",
      storeAs: "queuing",
      extraField: "queuePosition",
      choices: [
        { name: "Don't Queue, Just Play" },
        { name: "At End Of Queue" },
        { name: "At Start Of Queue" },
        {
          name: "At Custom Position",
          field: true,
          placeholder: "Queue Starts At #0",
        },
      ],
    },
    {
      element: "toggle",
      storeAs: "logging",
      name: "Log Debug Statements"
    }
  ],
  subtitle: (values, constants) => {
    return `File: ${constants.variable(values.bufferVar)} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const fs = require("fs")
    const ffmpeg = require("ffmpeg")
    const {Readable} = require("stream")
    const { createAudioResource } = require("@discordjs/voice")

    let audioBuffer = bridge.get(values.bufferVar)

    if (values.logging == true){
      console.log(audioBuffer instanceof Buffer)
      console.log(typeof audioBuffer)
    }

    let audioStream = Readable.from(audioBuffer)
    let audio = createAudioResource(audioStream);

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audio);
        utilities.nowPlaying = {
          file: "Binary Stream",
          name: "Binary Stream",
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: "Binary Stream",
          name: "Binary Stream",
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: "Binary Stream",
          name: "Binary Stream",
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: "Binary Stream",
          name: "Binary Stream",
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;
    }
  },
};
