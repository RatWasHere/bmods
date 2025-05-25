const { Client } = require("oceanic.js");

module.exports = {
  name: "Member Timeout Remove",
  nameSchemes: ["Store Member As", "Store Server As"],

  /**
   * @param {Client} client
   * @param {*} data
   * @param {*} run
   */
  initialize(client, data, run) {
    client.on("guildMemberUpdate", async (member, oldMember) => {
      if (
        !member.communicationDisabledUntil &&
        oldMember.communicationDisabledUntil
      ) {
        run([member, member.guild], member);
      }
    });
  },
};
