const { Role } = require("oceanic.js");
const { Permission } = require("oceanic.js");

modVersion = "v1.0.0";

module.exports = {
  category: "Roles",
  data: {
    name: "Get Role Info PLUS",
    role: {type: "mentioned", value: ""}
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  aliases: ["Store Role Info"],
  UI: [
    {
      element: "role",
      name: "Role",
      storeAs: "role",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name", category: "Basic Info" },
        id: { name: "ID" },
        guild: { name: "Server" },
        
        color: { name: "Color", category: "Misc" },
        permission: { name: "Permission" },
        position: { name: "Position" },
        members: { name: "Members" },

        hoist: { name: "Separate display (True/False)", category: "True/False" },
        mentionable: { name: "Mention to all (True/False)" },
        managed: { name: "Controlled by a bot or integration (True/False)" },
        availableForPurchase: { name: "Available for purchase (True/False)" },
        premiumSubscriber: { name: "Premium Subscriber (True/False)" },

      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.role(values.role)} - Store As: ${constants.variable(values.store)}`
  },
  

  async run(values, message, client, bridge) {    
    /**
     * @type {Role}
     */
    let role = await bridge.getRole(values.role);

    let output;
    switch (values.get.type) {
      case "color":
        output = role.color.toString(16);
        break;
      case "permission":
        output =  Object.keys(new Permission(role.permissions.allow).json).map(perm => perm.toLowerCase());
        break;
      case "members":
        output = (await require('./getGuildInfo').getMembers(bridge)).filter(m => m.roles.includes(role.id));
        break;
      case "availableForPurchase":
        output = role.tags.availableForPurchase;
        break;
      case "premiumSubscriber":
        output = role.tags.premiumSubscriber;
        break;
      default:
        output = role[values.get.type];
        break;
    }

    bridge.store(values.store, output)
  },
};
