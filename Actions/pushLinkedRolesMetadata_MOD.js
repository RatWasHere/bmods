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
          UI: [{
                  element: "menu",
                  max: 1,
                  storeAs: "comparisonlist",
                  name: "Comparison",
                  types: {
                      Comparison: "Comparison",
                  },
                  UItypes: {
                      Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [{
                                  element: "var",
                                  storeAs: "variable",
                              },
                              "-",
                              {
                                  element: "halfDropdown",
                                  storeAs: "comparator",
                                  extraField: "compareValue",
                                  name: "Comparison Type",
                                  choices: [{
                                          name: "Equals",
                                          field: true,
                                          placeholder: "Equals To",
                                      },
                                      {
                                          name: "Equals Exactly",
                                          field: true,
                                      },
                                      {
                                          name: "Doesn't Equal",
                                          field: true,
                                      },
                                      {
                                          name: "Exists",
                                      },
                                      {
                                          name: "Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Is Number",
                                      },
                                      {
                                          name: "Matches Regex",
                                          field: true,
                                          placeholder: "Regex",
                                      },
                                      {
                                          name: "Exactly includes",
                                          field: true,
                                          placeholder: "Text",
                                      },
                                  ],
                              },
                          ],
                      },
                  },
              },
              "-",
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
          UI: [{
                  element: "menu",
                  max: 1,
                  storeAs: "comparisonlist",
                  name: "Comparison",
                  types: {
                      Comparison: "Comparison",
                  },
                  UItypes: {
                      Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [{
                                  element: "var",
                                  storeAs: "variable",
                              },
                              "-",
                              {
                                  element: "halfDropdown",
                                  storeAs: "comparator",
                                  extraField: "compareValue",
                                  name: "Comparison Type",
                                  choices: [{
                                          name: "Equals",
                                          field: true,
                                          placeholder: "Equals To",
                                      },
                                      {
                                          name: "Equals Exactly",
                                          field: true,
                                      },
                                      {
                                          name: "Doesn't Equal",
                                          field: true,
                                      },
                                      {
                                          name: "Exists",
                                      },
                                      {
                                          name: "Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Is Number",
                                      },
                                      {
                                          name: "Matches Regex",
                                          field: true,
                                          placeholder: "Regex",
                                      },
                                      {
                                          name: "Exactly includes",
                                          field: true,
                                          placeholder: "Text",
                                      },
                                  ],
                              },
                          ],
                      },
                  },
              },
              "-",
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
          UI: [{
                  element: "menu",
                  max: 1,
                  storeAs: "comparisonlist",
                  name: "Comparison",
                  types: {
                      Comparison: "Comparison",
                  },
                  UItypes: {
                      Comparison: {
                          name: "Comparison",
                          data: {},
                          UI: [{
                                  element: "var",
                                  storeAs: "variable",
                              },
                              "-",
                              {
                                  element: "halfDropdown",
                                  storeAs: "comparator",
                                  extraField: "compareValue",
                                  name: "Comparison Type",
                                  choices: [{
                                          name: "Equals",
                                          field: true,
                                          placeholder: "Equals To",
                                      },
                                      {
                                          name: "Equals Exactly",
                                          field: true,
                                      },
                                      {
                                          name: "Doesn't Equal",
                                          field: true,
                                      },
                                      {
                                          name: "Exists",
                                      },
                                      {
                                          name: "Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Less Than",
                                          field: true,
                                      },
                                      {
                                          name: "Equal Or Greater Than",
                                          field: true,
                                      },
                                      {
                                          name: "Is Number",
                                      },
                                      {
                                          name: "Matches Regex",
                                          field: true,
                                          placeholder: "Regex",
                                      },
                                      {
                                          name: "Exactly includes",
                                          field: true,
                                          placeholder: "Text",
                                      },
                                  ],
                              },
                          ],
                      },
                  },
              },
              "-",
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
              let matchesCriteria = true;

              if (item.data.comparisonlist && item.data.comparisonlist[0]) {
                  matchesCriteria = false;
                  let variable = bridge.get(
                      item.data.comparisonlist[0].data.variable
                  );
                  let secondValue = bridge.transf(
                      item.data.comparisonlist[0].data.compareValue
                  );

                  switch (item.data.comparisonlist[0].data.comparator) {
                      case "Equals":
                          if (`${variable}` == `${secondValue}`) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Doesn't Equal":
                          if (variable != secondValue) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Exists":
                          matchesCriteria = variable != null || variable != undefined;
                          break;

                      case "Equals Exactly":
                          if (variable === secondValue) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Greater Than":
                          if (Number(variable) > Number(secondValue)) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Less Than":
                          if (Number(variable) < Number(secondValue)) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Equal Or Greater Than":
                          if (Number(variable) >= Number(secondValue)) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Equal Or Less Than":
                          if (Number(variable) <= Number(secondValue)) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Is Number":
                          if (
                              typeof parseInt(variable) == "number" &&
                              `${parseInt(variable)}` != `NaN`
                          ) {
                              matchesCriteria = true;
                          }
                          break;

                      case "Matches Regex":
                          matchesCriteria = Boolean(
                              variable.match(new RegExp("^" + secondValue + "$", "i"))
                          );
                          break;

                      case "Exactly includes":
                          if (typeof variable?.toString().includes === "function") {
                              matchesCriteria = variable.toString().includes(secondValue);
                          }
                          break;
                  }
              }
              if (matchesCriteria == true) {

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