module.exports = {
  name: "User Name Changed",
  nameSchemes: ["Store User As", "Store New Name As"],
  
  initialize(client, data, run) {
    client.on('userUpdate', async (oldUser, newUser) => {
      if (oldUser.globalName !== newUser.globalName) {
        if (!newUser || !newUser.globalName) {
          return;
        }
        
        run([oldUser, oldUser.globalName], newUser);
      }
    });
  }
};
