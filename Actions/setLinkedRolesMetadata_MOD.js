module.exports = {
  data: {
    name: "Set Linked Roles Metadata",
  },
  category: "Linked Roles",
  UI: [
    {
      element: "menu",
      storeAs: "types",
      max: 5,
      name: "Metadata",
      types: {
        numberLt: "Number Less Than or Equal",
        numberGt: "Number Greater Than or Equal",
        numberEq: "Number Equal",
        numberNeq: "Number Not Equal",
        datetimeLt: "Date/Time Less Than or Equal",
        datetimeGt: "Date/Time Greater Than or Equal",
        booleanEq: "Boolean Equal",
      },

      UItypes: {
        numberLt: {
          name: "Number Less Than or Equal",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "cookies (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "Cookie"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "A cookie",
            },
          ]
        },
        numberGt: {
          name: "Number Greater Than or Equal",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "cookies (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "Cookie Count"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "Number of cookies earned",
            },
          ]
        },
        numberEq: {
          name: "Number Equal To",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "level (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "User Level"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "Current level in the server",
            },
          ]
        },
        numberNeq: {
          name: "Number Not Equal To",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "rank (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "User Rank"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "Current rank position",
            },
          ]
        },
        datetimeLt: {
          name: "Date/Time Less Than or Equal To",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "join_date (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "Joined Before"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "User joined before specified date",
            },
          ]
        },
        datetimeGt: {
          name: "Date/Time Greater Than or Equal To",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "member_since (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "Member Since"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "User has been a member since date",
            },
          ]
        },
        booleanEq: {
          name: "Boolean Equal To",
          data: {
            key: "",
            name: "",
            desc: "",
          },
          UI: [
            {
              element: "input",
              name: "Key",
              storeAs: "key",
              placeholder: "verified (must be lowercase)",
            },
            "-",
            {
              element: "input",
              name: "Name",
              storeAs: "name",
              placeholder: "Verified Status"
            },
            "-",
            {
              element: "input",
              name: "Description",
              storeAs: "desc",
              placeholder: "Whether the user is verified",
            },
          ]
        }
      }
    }

  ],
  subtitle: (values) => {
    return `Set Linked Roles Metadata`;
  },

  async run(values, message, client, bridge) {
    const TYPE_MAPPING = {
      numberLt: 1,
      numberGt: 2,
      numberEq: 3,
      numberNeq: 4,
      datetimeLt: 5,
      datetimeGt: 6,
      booleanEq: 7,
    };

    try {
      if (!client.user?.id || !client.options?.auth) {
        console.error("Missing client authentication or client ID");
        return false;
      }

      if (!values.types || !Array.isArray(values.types) || values.types.length === 0) {
        console.error("No metadata types defined");
        return false;
      }

      if (values.types.length > 5) {
        console.warn("Discord only supports up to 5 metadata fields. Extra fields will be ignored.");
        values.types = values.types.slice(0, 5);
      }

      const body = values.types.map(type => {
        if (!type.data?.key) {
          console.warn(`Skipping metadata with missing key: ${type.type}`);
          return null;
        }

        return {
          key: type.data.key,
          name: type.data.name || type.data.key,
          description: type.data.desc || "",
          type: TYPE_MAPPING[type.type] || null,
        };
      }).filter(Boolean);

      if (body.length === 0) {
        console.error("No valid metadata to send");
        return false;
      }

      const url = `https://discord.com/api/v10/applications/${client.user.id}/role-connections/metadata`;
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': client.options.auth
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Linked roles metadata set successfully:", data);
        return data;
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: await response.text() };
        }

        console.error(`Discord API Error [${response.status}]: ${response.statusText}`);
        console.error(errorData.message || JSON.stringify(errorData));
        return false;
      }
    } catch (error) {
      console.error("Failed to set linked roles metadata:", error.message || error);
      return false;
    }
  }

}
