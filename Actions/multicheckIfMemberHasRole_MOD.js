modVersion = "v1.0.0";

module.exports = {
  category: "Members",
  data: {
    name: "Multi Check If Member Has Role",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Member"
    },
    "-",
    {
      element: "dropdown",
      name: "If the user",
      storeAs: "info",
      choices: [
        { name: "Has all the roles" },
        { name: "Doesn't have all the roles" },
        { name: "Has one of the roles" },
        { name: "Does not have any of the roles" },
      ],
    },
    "_",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "Roles",
      types: {
        options: "Roles",
      },
      UItypes: {
        options: {
          name: "Roles",
          inheritData: true,
          UI: [
            {
              element: "variableInsertion",
              name: "List role",
              storeAs: "list"
            },
            "_",
            {
              element: "menu",
              storeAs: "cases",
              name: "Roles",
              types: {
                data: "Data",
              },
              max: 200,
              UItypes: {
                data: {
                  name: "Role",
                  preview:
                    "``",
                  data: { },
                  UI: [
                    {
                      element: "role",
                      name: "Role",
                      storeAs: "role"
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (data, constants) => {
    return `Member: ${constants.user(data.member)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let user   = await bridge.getUser(values.member);
    let member = await user.member;

    const formatType = values.info.toLowerCase();

    let hasAnyRole  = false;
    let hasAllRoles = true;

    if (Array.isArray(values.cases)) {
      for (const dataCase of values.cases) {
        try {
          let role = await bridge.getRole(dataCase.data.role);
          if (member.roles.includes(role.id)) {
            hasAnyRole = true;
          } else {
            hasAllRoles = false;
          }
        } catch (error) {}
      }
    }

    if (values.list) {
      try {
        let list = await bridge.get(values.list);
        if (Array.isArray(list) && list.length > 0) {
          for (const roleObj of list) {
            try {
              if (member.roles.includes(roleObj.id)) {
                hasAnyRole = true;
              } else {
                hasAllRoles = false;
              }
            } catch (error) {}
          }
        }
      } catch (error) {}
    }

    switch (formatType) {
      case "has all the roles": 
      if (hasAllRoles) {
        await bridge.call(values.true, values.trueActions);
      } else {
        await bridge.call(values.false, values.falseActions);
      }
      break;

      case "doesn't have all the roles": 
      if (!hasAnyRole) {
        await bridge.call(values.true, values.trueActions);
      } else {
        await bridge.call(values.false, values.falseActions);
      }
      break;

      case "has one of the roles": 
      if (hasAnyRole) {
        await bridge.call(values.true, values.trueActions);
      } else {
        await bridge.call(values.false, values.falseActions);
      }
      break;

      case "does not have any of the roles": 
      if (!hasAnyRole) {
        await bridge.call(values.true, values.trueActions);
      } else {
        await bridge.call(values.false, values.falseActions);
      }
      break;
    }
  },
};
