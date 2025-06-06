modVersion = "v1.0.0";

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
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Role As"
    },
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

      const filteredRoles = roles.filter((role) => {
          const isStandard = values.standard === true;
          const isIntegration = values.integration === true;
          const isDisplay = values.display === true;
          const isNotification = values.notification === true;
          const isAvailableForPurchase = values.availableForPurchase === true;
          const isPremiumSubscriber = values.premiumSubscriber === true;

          if (isStandard && (isIntegration || isDisplay || isNotification || isAvailableForPurchase || isPremiumSubscriber)) {
              return false;
          }

          let conditions = [];

          if (isIntegration) conditions.push(role.managed === true);
          if (isDisplay) conditions.push(role.hoist === true);
          if (isNotification) conditions.push(role.mentionable === true);
          if (isAvailableForPurchase) conditions.push(role.tags?.availableForPurchase === true);
          if (isPremiumSubscriber) conditions.push(role.tags?.premiumSubscriber === true);

          if (conditions.length === 0 && !isStandard) return true;

          return conditions.every(Boolean);
      });

      let toMatch = bridge.transf(values.value);

      let result;
      switch (values.method) {
          case "Role ID":
              result = filteredRoles.find((role) => role.id === toMatch);
              break;
          case "Role Name":
              result = filteredRoles.find((role) => role.name === toMatch);
              break;
          case "Role Position":
              const position = parseInt(toMatch, 10);
              result = filteredRoles.find((role) => role.position === position);
              break;
      }

      if (result !== undefined) {
          bridge.store(values.store, result);
          await bridge.call(values.ifexists, values.ifexistsActions);
      } else {
          await bridge.call(values.ifError, values.ifErrorActions);
      }
  },
};
