module.exports = {
  data: {
    name: "Push Linked Roles Metadata",
  },
  category: "Linked Roles",
  UI: [
    {
      element: "variable",
      name: "User",
      storeAs: "user",
      placeholder: "User to set metadata for",
    },
    "-",
    {
      element: "input",
      storeAs: "platformName",
      name: "Platform Name",
      placeholder: "A Cool bot",
    },
    "-",
    {
      element: "input",
      storeAs: "platformUsername",
      name: "Platform Username",
      placeholder: "CoolBot",
    },
    "-",
    {
      element: "menu",
      storeAs: "metadata",
      max: 5,
      name: "Metadata",
      types: {
        numberMetadata: "Number Metadata",
        booleanMetadata: "Boolean Metadata",
        datetimeMetadata: "DateTime Metadata"
      },

      UItypes: {
        numberMetadata: {
          name: "Number Metadata",
          data: {
            key: "",
            value: ""
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "cookies",
            },
            "-",
            {
              element: "input",
              name: "Value",
              storeAs: "value",
              placeholder: "100"
            }
          ]
        },
        booleanMetadata: {
          name: "Boolean Metadata",
          data: {
            key: "",
            value: ""
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "verified",
            },
            "-",
            {
              element: "toggle",
              name: "Value",
              storeAs: "value"
            }
          ]
        },
        datetimeMetadata: {
          name: "DateTime Metadata",
          data: {
            key: "",
            value: ""
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "joinDate",
            },
            "-",
            {
              element: "input",
              name: "Value",
              storeAs: "value",
              placeholder: "2023-05-25T12:00:00Z"
            }
          ]
        }
      }
    }

  ],
  subtitle: (values) => {
    return `Push Linked Roles Metadata`;
  },

  async run(values, message, client, bridge) {
    try {
      if (!values.user) {
        console.error("Missing required values (user)");
        return false;
      }

      const userToken = bridge.get(values.user)?.accessToken;
      if (!userToken) {
        console.error("User access token not found - ensure user is authenticated");
        return false;
      }

      const metadata = {};
      if (Array.isArray(values.metadata)) {
        for (const item of values.metadata) {
          if (!item.data.key || item.data.value === undefined) continue;

          if (item.type === 'numberMetadata') {
            metadata[item.data.key] = Number(item.data.value);
          } else if (item.type === 'booleanMetadata') {
            metadata[item.data.key] = Boolean(item.data.value);
          } else if (item.data.type === 'datetimeMetadata') {
            metadata[item.data.key] = item.data.value instanceof Date ?
              item.data.value.toISOString() : String(item.data.value);
          } else {
            metadata[item.data.key] = String(item.data.value);
          }
        }
      }

      const body = {
        platform_name: values.platformName,
        platform_username: values.platformUsername || values.platformName,
        metadata
      };
      const url = `https://discord.com/api/v10/users/@me/applications/${client.user.id}/role-connection`;
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Linked roles updated successfully for user");
        return data;
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }

        console.error(`Discord API Error [${response.status}]: ${errorData.message || response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error("Failed to push linked roles metadata:", error.message);
      return false;
    }
  }
};