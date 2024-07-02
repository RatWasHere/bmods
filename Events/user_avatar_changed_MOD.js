module.exports = {
  name: "User Avatar Changed",
  nameSchemes: ["Store User As", "Store New Avatar As"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Events",
    creator: "nitiqt"
  },
  
  initialize(client, data, run) {
    client.on('userUpdate', async (user, oldUser) => {
      if (user.avatar !== oldUser.avatar) {
        const oldAvatarURL = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096&ignore=true`
          : null;

        if (oldAvatarURL === null) {
          return;
        }

        run([user, oldAvatarURL], user);
      }
    });
  }
};
