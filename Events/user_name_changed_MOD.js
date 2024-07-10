module.exports = {
  name: "User Name Changed",
  nameSchemes: ["Store User As", "Store New Name As"],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Events",
    creator: "nitiqt"
  },
  
  initialize(client, data, run) {
    client.on('userUpdate', async (oldUser, newUser) => {
      if (oldUser.globalName !== newUser.globalName) {
        const oldGlobalName = oldUser.globalName ? oldUser.globalName : null;

        if (oldGlobalName === null) {
          return;
        }
        
        run([oldUser, oldGlobalName], newUser);
      }
    });
  }
};
