const { Shoukaku, Connectors } = require("shoukaku");
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: {
    name: "LavaMusic",
    description: "Plays a track from Lavalink in a voice channel",
  },
  category: "Audio",
  UI: [
    {
      element: "input",
      storeAs: "nodeName",
      name: "Lavalink Node Name",
    },
    {
      element: "input",
      storeAs: "nodeUrl",
      name: "Lavalink Node URL",
      placeholder: "e.g., localhost:2333",
    },
    {
      element: "input",
      storeAs: "nodeAuth",
      name: "Lavalink Node Password",
    },
    "-",
    {
      element: "input",
      storeAs: "songURL",
      name: "Song URL or Search Query",
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
        { name: "At Custom Position", field: true, placeholder: "Queue Starts At #0" },
      ],
    },
    {
      element: "actions",
      storeAs: "onPlayActions",
      name: "Actions on Play",
    },
    {
      element: "actions",
      storeAs: "onEndActions",
      name: "Actions on End",
    }
  ],

  async run(values, interaction, client, bridge) {
    const songURL = bridge.transf(values.songURL)

    nodeName = bridge.transf(values.nodeName)
    nodeUrl = bridge.transf(values.nodeUrl)
    nodeAuth = bridge.transf(values.nodeAuth)

    const nodes = [
      {
        name: nodeName,
        url: nodeUrl,
        auth: nodeAuth,
      }
    ]
    const options = {
      moveOnDisconnect: false,
      resumable: true,
      resumableTimeout: 30,
      reconnectTries: 3,
      reconnectInterval: 1000,
    }

    const shoukaku = new Shoukaku(new Connectors.OceanicJS(client), nodes, options)
    const shoukakuNode = shoukaku.getNode()
    const result = await shoukakuNode.rest.resolve(songURL)
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    })
    const track = result.tracks[0]

    switch (bridge.transf(values.queuing)) {
      case `Don't Queue, Just Play`:
        utilities.player.play(track)
        utilities.nowPlaying = {
          file: null,
          name: result.tracks[0].title,
          author: result.tracks[0].author
        }
    }


  }
}