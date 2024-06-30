module.exports = {
  name: "User Avatar Changed",
  nameSchemes: ["Store User As", "Store New Avatar As"],
  
  initialize(client, data, run) {
    client.on('userUpdate', async (user, oldUser) => {
      if (user.avatar !== oldUser.avatar) {
        if (user === null || user === undefined) {
          return;
        }
        
        const newAvatarURL = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096&ignore=true`
          : null;

        run([user, newAvatarURL], user);
      }
    });
  }
};
