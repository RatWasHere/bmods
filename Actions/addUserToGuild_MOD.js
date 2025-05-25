module.exports = {
  data: {
    name: "Add User to Guild",
  },
  category: "OAuth",
  UI: [
    {
      element: "variable",
      name: "User",
      storeAs: "user",
      placeholder: "User to add to guild",
    },
    "-",
    {
      element: "input",
      name: "Guild ID",
      storeAs: "guildId",
      placeholder: "Guild to add user to",
    },
  ],
  subtitle: (values) => {
    return `Add user to guild ${values.guildId}`;
  },
  async run(values, message, client, bridge) {
    try {
      if (!values.user || !values.guildId) {
        console.error("Missing required values (user or guildId)");
        return false;
      }

      const user = bridge.get(values.user);
      let guildId = bridge.transf(values.guildId);
      if (!user.id || !user.accessToken) {
        console.error("Invalid user object - missing ID or access token");
        return false;
      }

      guildId = String(values.guildId).trim();
      if (!guildId) {
        console.error("Invalid guild ID provided");
        return false;
      }

      const url = `https://discord.com/api/v10/guilds/${guildId}/members/${user.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': client.options.auth,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: user.accessToken
        })
      });

      if (response.ok) {
        console.log(`Successfully added user to guild ${guildId}`);

      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() || "Unknown error" };
        }

        console.error(`Discord API Error [${response.status}]: ${errorData.message || response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error("Failed to add user to guild:", error.message || error);
      return false;
    }
  }
};