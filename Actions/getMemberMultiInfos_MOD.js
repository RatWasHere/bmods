module.exports = {
  data: {
    name: "Get Member Multi Infos",
  },
  category: "Members",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "member",
      storeAs: "member",
      name: "Member",
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "Informations",
      types: {
        informations: "Informations",
      },
      max: 200,
      UItypes: {
        informations: {
          name: "Member Information",
          preview: "`Selected: ${option.data.memberinformations}`",
          data: { memberinformations: "Name" },
          UI: [
            {
              element: "dropdown",
              storeAs: "memberinformations",
              name: "Get Member Information",
              choices: [
                { name: "Name" },
                { name: "Nickname" },
                { name: "Username" },
                { name: "Server" },
                { name: "ID" },
                { name: "Avatar URL" },
                { name: "Banner URL" },
                { name: "Highest Role" },
                { name: "Role List" },
                { name: "Timeout End Timestamp" },
                { name: "Join Timestamp" },
                { name: "Boosting Start Timestamp" },
                { name: "Account Creation Timestamp" },
                { name: "Accent Color" },
                { name: "Voice Channel" },
                { name: "Status" },
                { name: "Status Text" },
              ],
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store As",
            },
          ],
        },
      },
    },
  ],

  subtitle: (values, constants, thisAction) => {
    let numInfos = values.cases.filter((c) => c.type === "informations").length;
    let memberValue = constants.user(values.member);

    return `Getting ${numInfos} Information(s) of ${memberValue}`;
  },

  async run(values, message, client, bridge) {
    let user = await bridge.getUser(values.member);
    let member = await user.member;

    for (const infoCase of values.cases) {
      if (infoCase.type !== "informations") continue;

      let output;
      switch (infoCase.data.memberinformations) {
        case "Name":
          output = user.globalName || user.username;
          break;
        case "Nickname":
          output = member.nick || member.displayName;
          break;
        case "Username":
          output = user.username;
          break;
        case "Server":
          output = member.guild || null;
          break;
        case "ID":
          output = user.id;
          break;
        case "Avatar URL":
          output = member.avatarURL() || user.avatarURL();
          break;
        case "Banner URL":
          let restUser = await client.rest.users.get(user.id);
          output = restUser.bannerURL();
          break;
        case "Highest Role":
          let highestRole;
          member.roles.forEach((roleID) => {
            let role = member.guild.roles.get(roleID);
            if (!highestRole || role.position > highestRole.position) {
              highestRole = role;
            }
          });
          output = highestRole || null;
          break;
        case "Role List":
          output = member.roles
            .map((roleID) => member.guild.roles.get(roleID))
            .filter((role) => role !== undefined);
          break;
        case "Timeout End Timestamp":
          output = member.communicationDisabledUntil?.getTime() || null;
          break;
        case "Join Timestamp":
          output = member.joinedAt?.getTime() || null;
          break;
        case "Boosting Start Timestamp":
          output = member.premiumSince?.getTime() || null;
          break;
        case "Account Creation Timestamp":
          output = user.createdAt.getTime() || null;
          break;
        case "Accent Color":
          let userDetails = await client.rest.users.get(user.id);
          output = userDetails.accentColor
            ? userDetails.accentColor.toString(16)
            : null;
          break;
        case "Voice Channel":
          if (member.voiceState?.channelID) {
            output = await bridge.getChannel({
              type: "id",
              value: member.voiceState.channelID,
            });
          } else {
            output = null;
          }
          break;
        case "Status":
          output = member.presence?.status || null;
          break;
        case "Status Text":
          try {
            output =
              member.presence.activities.find(
                (activity) =>
                  activity.type === 4 && activity.name === "Custom Status"
              )?.state || null;
          } catch (err) {
            output = null;
          }
          break;
        default:
          output = member[infoCase.data.memberinformations] || null;
          break;
      }

      bridge.store(infoCase.data.store, output);
    }
  },
};
