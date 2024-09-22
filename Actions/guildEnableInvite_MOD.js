module.exports = {
  data: {
    name: "Enable Guild Invites",
  },
  category: "Servers",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "default.io",
  },
  async run(values, interaction, client, bridge) {
    let guild = await bridge.getGuild(values.guild);

    if (guild) {
      await guild.enableInvites();
    }
  },
};