modVersion = "s.v1.0 | AceFix";
module.exports = {
  data: {
    name: "Get Bot Info",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Bot",
  UI: [
    {
      element: "halfDropdown",
      name: "Get",
      storeAs: "get",
      choices: [
        { name: "Name" },
        { name: "Servers" },
        { name: "Client ID" },
        { name: "Avatar URL" },
        { name: "Prefix" },
        { name: "Directory" },
        { name: "Token" },
        { name: "Gateway Ping" },
        { name: "REST Ping" },
        { name: "Total Amount of Guilds" },
        { name: "Total Amount of Channels" },
        { name: "Total Amount of Commands/Events" },
        { name: "Total Amount of Users" },
        { name: "Guilds Objects" },
        { name: "Oceanic Version" },
        { name: "NodeJS Version" },
        { name: "Uptime in Days" },
        { name: "Uptime in Hours" },
        { name: "Uptime in Minutes" },
        { name: "Uptime in Seconds" },
        { name: "Uptime Timestamp" },
        { name: "Normalized Uptime Timestamp" },
        { name: "Operating System" },
        { name: "Memory Usage in MB" },
      ],
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `${values.get} - Store As: ${constants.variable(values.store)}`;
  },

  /**
   * @param {oceanic.Client} client
   * @returns {*}
   */
  async run(values, message, client, bridge) {
    const botData = require("../data.json");
    const oceanic = require("oceanic.js");
    let output;

    switch (values.get) {
      case "Name":
        output = botData.name;
        break;
      case "Servers":
        output = client.guilds.map((guild, index) => guild);
        break;
      case "Client ID":
        output = client.application.id;
        break;
      case "Avatar URL":
        output = await (
          await client.rest.users.get(client.application.id)
        ).avatarURL();
        break;
      case "Prefix":
        output = botData.prefix;
        break;
      case "Directory":
        output = process.cwd();
        break;
      case "Token":
        output = botData.btk;
        break;
      case "Gateway Ping":
        output = client.shards.first().latency;
        break;
      case "REST Ping":
        output = client.rest.handler.latencyRef.latency;
        break;
      case "Total Amount of Guilds":
        output = client.guilds.size;
        break;
      case "Total Amount of Channels":
        output = Object.keys(client.channelGuildMap).length;
        break;
      case "Total Amount of Commands/Events":
        output = botData.commands.length;
        break;
      case "Total Amount of Users":
        output = client.users.size;
        break;
      case "Guilds Objects":
        output = client.guilds;
        break;
      case "Oceanic Version":
        output = oceanic.Constants.VERSION;
        break;
      case "NodeJS Version":
        output = process.versions.node;
        break;
      case "Uptime in Days":
        output = Math.floor((process.uptime() % 31536000) / 86400);
        break;
      case "Uptime in Hours":
        output = Math.floor((process.uptime() % 86400) / 3600);
        break;
      case "Uptime in Minutes":
        output = Math.floor((process.uptime() % 3600) / 60);
        break;
      case "Uptime in Seconds":
        output = Math.round(process.uptime() % 60);
        break;
      case "Normalized Uptime Timestamp":
        output = Math.floor(Date.now() / 1000) - Math.floor(process.uptime());
        break;
      case "Uptime Timestamp":
        output = Math.floor(Date.now()) - Math.floor(process.uptime() * 1000);
        break;
      case "Operating System": {
        if (process.platform) {
          const platform = process.platform;
          if (platform === "win32") output = "Windows";
          else if (platform === "aix") output = "Aix";
          else if (platform === "linux") output = "Linux";
          else if (platform === "darwin") output = "Darwin";
          else if (platform === "openbsd") output = "OpenBSD";
          else if (platform === "sunos") output = "Solaris";
          else if (platform === "freebsd") output = "FreeBSD";
        }
        break;
      }
      case "Memory Usage in MB":
        output = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        break;
    }

    bridge.store(values.store, output);
  },
};
