const { Client } = require("oceanic.js");

module.exports = {
  name: "Member Boosted Server",
  nameSchemes: ["Store Member As", "Store Server As"],

  /**
   * @param {Client} client
   * @param {*} data
   * @param {*} run
   */
  initialize(client, data, run) {
    client.on("guildMemberUpdate", async (member, oldMember) => {
      if (!oldMember.premiumSince && member.premiumSince) {
        run([member, member.guild], member);
      }
    });
  },
};
