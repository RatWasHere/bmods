module.exports = {
  data: {
    name: "Bulk Timeout Members",
  },
  category: "Members",
  aliases: ["Bulk Mute Members"],
  info: {
    creator: "Fusionist-0",
  },
  UI: [
    {
      element: "guild",
      storeAs: "guild",
    },
    "-",
    {
      element: "var",
      storeAs: "members",
      name: "Members",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "unitsOfTime",
      extraField: "timeoutDuration",
      name: "Timeout For",
      choices: [
        { name: "Second(s)", field: true },
        { name: "Minute(s)", field: true },
        { name: "Hour(s)", field: true },
        { name: "Day(s)", field: true }
      ],
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason",
      placeholder: "Optional",
    }
  ],

  subtitle: (values, constants) => {
    return `Timeout ${constants.variables(values.members)} - Reason: ${values.reason}`;
  },

  async run(values, message, client, bridge) {

    const rawMembers = await bridge.get(values.members);
    const guild = await bridge.getGuild(values.guild);
    if (!guild) return;

    // Extract IDs from mention strings
    const memberIDs = [];
    if (Array.isArray(rawMembers)) {
      for (const entry of rawMembers) {
        if (typeof entry === "string") {
          const match = entry.match(/\d{17,19}/);
          if (match) memberIDs.push(match[0]);
        }
      }
    }

    if (!memberIDs.length) return;

    // Convert duration
    const rawAmount = parseFloat(bridge.transf(values.timeoutDuration));
    if (!Number.isFinite(rawAmount) || rawAmount <= 0) return;

    const units = {
      "Second(s)": 1000,
      "Minute(s)": 60000,
      "Hour(s)": 3600000,
      "Day(s)": 86400000,
    };

    let unit = values.unitsOfTime;
    if (unit === 0 || unit === "0") unit = "Second(s)";
    if (unit === 1 || unit === "1") unit = "Minute(s)";
    if (unit === 2 || unit === "2") unit = "Hour(s)";
    if (unit === 3 || unit === "3") unit = "Day(s)";

    const ms = rawAmount * (units[unit] || 1000);
    const until = new Date(Date.now() + ms).toISOString();
    const reason = bridge.transf(values.reason) || undefined;

    // Apply timeouts
    for (const id of memberIDs) {
      try {
        const member = await guild.getMember(id).catch(() => null);
        if (!member) continue;

        await member.edit({
          communicationDisabledUntil: until,
          reason
        });
      } catch {
        // ignore individual failures
      }
    }
  },
};