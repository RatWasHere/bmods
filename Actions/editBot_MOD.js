module.exports = {
  data: { name: "Edit Bot" },
  category: "Bot",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt"
  },
  UI: [
    {
      element: "image",
      storeAs: "avatar",
      name: "Avatar URL",
    },
    "-",
    {
      element: "image",
      storeAs: "banner",
      name: "Banner URL",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "username",
      choices: {
        none: { name: "None" },
        set: { name: "Change", field: true },
      },
      name: "Username"
    },
  ],

  subtitle: (values) => {
    let changes = [];
    if (values.avatar.type !== 'none') changes.push("Avatar");
    if (values.banner.type !== 'none') changes.push("Banner");
    if (values.username.type !== 'none') changes.push("Username");

    return changes.length === 0 ? "Change: Nothing" : `Change: ${changes.join(", ")}`;
  },

  async run(values, message, client, bridge) {

    let editOptions = {};

    if (values.avatar.type !== 'none') {
      editOptions.avatar = await bridge.getImage(values.avatar);
    }

    if (values.banner.type !== 'none') {
      editOptions.banner = await bridge.getImage(values.banner);
    }

    if (values.username.type !== 'none') {
      editOptions.username = values.username.value;
    }

    await client.user.edit(editOptions);
  },
};
