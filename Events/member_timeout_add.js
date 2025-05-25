const { Client } = require("oceanic.js");

module.exports = {
  name: "Member Timeout Add",
  nameSchemes: ["Store Member As", "Store Server As"],

  /**
   * @param {Client} client
   * @param {*} data
   * @param {*} run
   */
  initialize(client, data, run) {
    client.on("guildMemberUpdate", async (member, oldMember) => {
      if (
        !oldMember.communicationDisabledUntil &&
        member.communicationDisabledUntil
      ) {
        run([member, member.guild], member);
      }
    });
  },
};
