const p = {
  'ADMINISTRATOR': "Administrator",
  'MODERATE_MEMBERS': "Moderate Members",
  'KICK_MEMBERS': "Kick Members",
  'BAN_MEMBERS': "Ban Members",
  'MANAGE_ROLES': "Manage Roles",
  'MANAGE_MESSAGES': "Manage Messages",
  'ADD_REACTIONS': "Add Reactions",
  'ATTACH_FILES': "Attach Files",
  'MANAGE_CHANNELS': "Manage Channels",
  'MANAGE_WEBHOOKS': "Manage Webhooks",
  'CHANGE_NICKNAME': "Change Nickname",
  'MANAGE_NICKNAMES': "Manage Nicknames",
  'CREATE_PUBLIC_THREADS': "Create Threads",
  'CREATE_PRIVATE_THREADS': "Create Private Threads",
  'MANAGE_THREADS': "Manage Threads",
  'CREATE_EVENTS': "Create Events",
  'MANAGE_EVENTS': "Manage Events",
  'MENTION_EVERYONE': "Mention Everyone",
  'VIEW_AUDIT_LOG': "View Audit",
  'MANAGE_GUILD': "Manage Server",
  'SPEAK': "Speak",
  'CONNECT': "Join Voice Channels",
  'MUTE_MEMBERS': "Mute Members",
  'DEAFEN_MEMBERS': "Deafen Members",
  'MOVE_MEMBERS': "Move Members",
  'USE_VAD': "Use VAD",
  'USE_SOUNDBOARD': "Use Soundboard",
  'USE_EXTERNAL_SOUNDS': "Use External Sounds",
  'USE_EXTERNAL_EMOJIS': "Use External Emojis",
  'USE_EXTERNAL_STICKERS': "Use External Stickers",
  'SEND_VOICE_MESSAGES': "Send Voice Messages",
  'EMBED_LINKS': "Embed Links",
  'SEND_POLLS': "Send Polls",
  'SEND_MESSAGES_IN_THREADS': "Message In Threads",
  'VIEW_GUILD_INSIGHTS': "View Insights",
  'CREATE_GUILD_EXPRESSIONS': "Create Expressions",
  'MANAGE_GUILD_EXPRESSIONS': "Manage Expressions",
  'READ_MESSAGE_HISTORY': "View Message History",
  'USE_EMBEDDED_ACTIVITIES': "Use Activities",
  'PRIORITY_SPEAKER': "Priority Speaker",
  'VIEW_CHANNEL': "View Channels",
}

modVersion = "v1.2.0";

module.exports = {
  category: "Roles",
  data: { name: "Find Role PLUS" },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "dropdown",
      name: "Find Role By",
      storeAs: "method",
      extraField: "value",
      choices: [
        {
          name: "Role Name",
          field: true,
        },
        {
          name: "Role ID",
          field: true,
        },
        {
          name: "Role Position",
          field: true
        }
      ]
    },
    {
      element: "toggleGroup",
      storeAs: ["standard", "integration"],
      nameSchemes: ["Everything is off", "Integration"],
    },
    {
      element: "toggleGroup",
      storeAs: ["display", "notification"],
      nameSchemes: ["Display", "Notification"],
    },
    {
      element: "toggleGroup",
      storeAs: ["availableForPurchase", "premiumSubscriber"],
      nameSchemes: ["Available for purchase", "Premium Subscriber"],
    },    
    {        
      element: "menu",
      storeAs: "cases",
      name: "Check Permission",
      types: {
        data: "Data",
      },
      max: 200,
      UItypes: {
        data: {
          name: "Permission",
          preview: "`Permission: ${option.data.permission} - ${option.data.compile}`",
          data: { permission: "Administrator" , compile: true },
          UI: [
            {
              element: "halfDropdown",
              storeAs: "permission",
              forcePush: true,
              name: "Check If Role Has Permission",
              choices: Object.values(p).map(permission => {return {name: permission}})
            },
            "-",
            {
              element: "toggle",
              storeAs: "compile",
              name: "Is it enabled",
              true: "Yes!",
              false: "Nono!",
            },
          ],
        },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Role As"
    },
    {
      element: "store",
      storeAs: "storeerorr",
      name: "Store List Conditions (Erorr)"
    },
    "-",
    {
      element: "condition",
      storeAs: "ifexists",
      storeActionsAs: "ifexistsActions",
      name: "If it exists",
    },
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If not found",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value || "Blank"}) - Store As ${constants.variable(data.store)}`
  },
  async run(values, message, client, bridge) {
      let roles = await bridge.guild.getRoles();
      
      let toMatch = bridge.transf(values.value);
      let result;
      
      switch (values.method) {
          case "Role ID":
              result = roles.find((role) => role.id === toMatch);
              break;
          case "Role Name":
              result = roles.find((role) => role.name === toMatch);
              break;
          case "Role Position":
              const position = parseInt(toMatch, 10);
              result = roles.find((role) => role.position === position);
              break;
      }
      
      if (!result) {
          bridge.store(values.storeerorr, ["not_found"]);
          await bridge.call(values.ifError, values.ifErrorActions);
          return;
      }
      
      const failedFilters = [];
      
      const isStandard = values.standard === true;
      const isIntegration = values.integration === true;
      const isDisplay = values.display === true;
      const isNotification = values.notification === true;
      const isAvailableForPurchase = values.availableForPurchase === true;
      const isPremiumSubscriber = values.premiumSubscriber === true;
      
      if (isStandard && (isIntegration || isDisplay || isNotification || isAvailableForPurchase || isPremiumSubscriber)) {
          failedFilters.push("standard");
      }
      
      if (isIntegration && !result.managed) failedFilters.push("integration");
      if (isDisplay && !result.hoist) failedFilters.push("display");
      if (isNotification && !result.mentionable) failedFilters.push("notification");
      if (isAvailableForPurchase && !result.tags?.availableForPurchase) failedFilters.push("availableForPurchase");
      if (isPremiumSubscriber && !result.tags?.premiumSubscriber) failedFilters.push("premiumSubscriber");
      
      if (Array.isArray(values.cases)) {
          for (const dataCase of values.cases) {
              if (dataCase.type !== "data") continue;
              
              const casePermissionKey = dataCase.data?.permission;
              const compile = dataCase.data?.compile === true;
              
              if (!casePermissionKey) continue;
              
              const permissionName = String(casePermissionKey).toUpperCase();
              const hasPermission = result.permissions.has(permissionName);
              
              if ((compile && !hasPermission) || (!compile && hasPermission)) {
                  failedFilters.push(permissionName.toLowerCase());
              }
          }
      }
      
      if (failedFilters.length > 0) {
          bridge.store(values.storeerorr, failedFilters);
          await bridge.call(values.ifError, values.ifErrorActions);
      } else {
          bridge.store(values.store, result);
          await bridge.call(values.ifexists, values.ifexistsActions);
      }
  },
};
