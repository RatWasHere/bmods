modVersion = "s.v1.2"
module.exports = {
  data: {
    name: "Play Binary Variable",
  },
  modules: ["fs", "ffmpeg", "stream", "@discordjs/voice", "libsodium", "libsodium-wrappers"],
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
    {
      element: "input",
      storeAs: "songName",
      name: "Song Name",
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
    },
    {
      element: "text",
      text: modVersion,
    }
  ],
  subtitle: (values, constants) => {
    return `File: ${constants.variable(values.bufferVar)} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    await client.getMods().require("fs")
    await client.getMods().require("ffmpeg")
    await client.getMods().require("stream")
    await client.getMods().require("@discordjs/voice")

    const fs = require("fs")
    const ffmpeg = require("ffmpeg")
    const {Readable} = require("stream")
    const { createAudioResource } = require("@discordjs/voice")

    let audioBuffer = bridge.get(values.bufferVar)
    let songName = bridge.transf(values.songName)

    if (values.logging == true){
      console.log("Instance Of Buffer:",audioBuffer instanceof Buffer)
      console.log("Type Of:",typeof audioBuffer)
    }

    if (audioBuffer instanceof Buffer == true && typeof audioBuffer == "object"){
      let audioStream = Readable.from(audioBuffer)
      let audio = createAudioResource(audioStream)
    

      let utilities = bridge.getGlobal({
        class: "voice",
        name: bridge.guild.id,
      });

      switch (values.queuing) {
        case `Don't Queue, Just Play`:
          utilities.player.play(audio);
          utilities.nowPlaying = {
            file: "Binary Stream",
            name: songName,
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
            name: songName,
            author: "",
            url: "",
            src: "Local",
            audio: audio,
          });
          break;

        case `At Start Of Queue`:
          utilities.addToQueue(0, {
            file: "Binary Stream",
            name: songName,
            author: "",
            url: "",
            src: "Local",
            audio: audio,
          });
          break;

        case `At Custom Position`:
          utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
            file: "Binary Stream",
            name: songName,
            author: "",
            url: "",
            src: "Local",
            audio: audio,
          });
          break;
      }
    }

    else{
      console.log(`Variable Is Not A Instance Of Buffer And Can't Be Played.`)
    }
  },
};
