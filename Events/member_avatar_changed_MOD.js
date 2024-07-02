module.exports = {
  name: "Member Avatar Changed",
  nameSchemes: ["Store Member As", "Store Server As", "Store New Avatar As"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Events",
    creator: "nitiqt"
  },
  
  initialize(client, data, run) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.avatar !== newMember.avatar) {
        const oldAvatarURL = oldMember.avatar 
          ? `https://cdn.discordapp.com/guilds/${newMember.guildID}/users/${newMember.id}/avatars/${oldMember.avatar}.${oldMember.avatar.startsWith("a_") ? "gif" : "png"}?size=4096&ignore=true`
          : null;

        if (oldAvatarURL === null) {
          return;
        }

        const guild = newMember.guild || (await client.rest.guilds.get(newMember.guildID));

        run([oldMember, guild, oldAvatarURL], newMember);
      }
    });
  }
};
