const generatePoToken = require("./generatePoToken");
modVersion = "s.v1.0 | AceTweaks";

module.exports = {
  data: {
    name: "Play YouTube Song",
  },
  category: "Music",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
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
    "-",
    {
      element: "input",
      name: "Timeout After x Seconds Of Trying To Fetch Audio | Leave Empty For 60s",
      placeholder: "20",
      storeAs: "timeoutAfter",
    },
    {
      element: "condition",
      storeAs: "timeoutCondition",
      storeActionsAs: "timeoutActions",
      name: "If Timeout Occurs",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (values, constants) => {
    return `URL: ${values.url} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const fs = require("fs");
    const search = require("yt-search");
    const stream = require("stream");
    const ytdl = require("@distube/ytdl-core");
    const randInt = (Date.now() * Math.random() * 1000 * Math.random() * 1000)
      .toString()
      .replaceAll(".", "")
      .replaceAll(",", "")
      .slice(0, 16);
    const generatedFilePath = `./temp_${new Date().getTime()}_${randInt}.mp3`;
    const { createAudioResource } = require("@discordjs/voice");
    let timeoutDur = values.timeoutAfter
      ? parseInt(bridge.transf(values.timeoutAfter)) * 1000
      : 60000;

    const result = await search(bridge.transf(values.url));
    let url = result.videos[0]?.url || bridge.transf(values.url);
    try {
      await Promise.race([
        new Promise((resolve, reject) => {
          let stream = ytdl(url, { filter: "audioonly" })
            .pipe(fs.createWriteStream(generatedFilePath))
            .on("finish", () => {
              stream.close();
              resolve();
            })
            .on("error", (err) => {
              fs.unlinkSync(generatedFilePath);
              reject(err);
            });
        }),

        new Promise((_, reject) =>
          setTimeout(() => {
            reject(new Error(`Fetching Audio Took Too Long!`));
          }, timeoutDur)
        ),
      ]);
    } catch (err) {
      console.error(err);
      bridge.call(values.timeoutCondition, values.timeoutActions);
      fs.unlinkSync(generatedFilePath);
      return;
    }

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
          playURL: url,
        };
        client.emit(
          "trackStart",
          bridge.guild,
          utilities.channel,
          utilities.nowPlaying
        );
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0],
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
          raw: result.videos[0],
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
          raw: result.videos[0],
        });
        break;
    }
  },
};
