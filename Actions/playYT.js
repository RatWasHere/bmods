const generatePoToken = require('./generatePoToken');

module.exports = {
  data: {
    name: "Play YouTube Song",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "URL",
      placeholder: "YouTube Video URL",
      storeAs: "url",
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
  ],
  subtitle: (values, constants) => {
    return `URL: ${values.url} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const fs = require('fs');
    const search = require('yt-search');
    const stream = require('stream');
    const ytdl = require('@distube/ytdl-core');
    let randInt = (Date.now()*Math.random()*1000*Math.random()*1000).toString().replaceAll(".","").replaceAll(",","").slice(0,32)
    let generatedFilePath = `./temp_${new Date().getTime()}_${randInt}.mp3`
    const { createAudioResource } = require('@discordjs/voice');

    const result = await search(bridge.transf(values.url));
    let url = result.videos[0]?.url || bridge.transf(values.url);
    await new Promise((resolve, reject) => {
      let stream = ytdl(url, { filter: 'audioonly' }).pipe(fs.createWriteStream(generatedFilePath)).on('finish', () => {
        stream.close();
        resolve();
      });
    });

    let Readable = stream.Readable.from(fs.readFileSync(generatedFilePath));
    const audio = createAudioResource(Readable);

    fs.unlinkSync(generatedFilePath);

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });


    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audio);
        utilities.nowPlaying = {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio,
          raw: result.videos[0],
          playURL: url
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;
    }
  },
};
