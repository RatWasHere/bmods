module.exports = {
  name: "Member Nickname Changed",
  nameSchemes: ["Store Member As", "Store Server As", "Store New Nickname As"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Events",
    creator: "nitiqt"
  },
  
  initialize(client, data, run) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.nick !== newMember.nick) {
        const oldNickname = oldMember.nick ? oldMember.nick : null;

        if (oldNickname === null) {
          return;
        }

        const guild = newMember.guild || (await client.rest.guilds.get(newMember.guildID));

        run([oldMember, guild, oldNickname], newMember);
      }
    });
  }
};
