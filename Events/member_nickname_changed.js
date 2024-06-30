module.exports = {
  name: "Member Nickname Changed",
  nameSchemes: ["Store Member As", "Store Server As", "Store New Nickname As"],
  
  initialize(client, data, run) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.nick !== newMember.nick) {
        if (newMember.nick === null || newMember.nick === undefined) {
          return;
        }

        const guild = newMember.guild || (await client.rest.guilds.get(newMember.guildID));

        run([oldMember, guild, oldMember.nick], newMember);
      }
    });
  }
};
