module.exports = {
  data: {
    name: "Control Member Multi Datas",
  },
  category: "Member Data",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "userInput",
      storeAs: "user",
      name: "Member",
    },
    "-",
    {
      element: "menu",
      storeAs: "cases",
      name: "Datas",
      types: {
        data: "Data",
      },
      max: 200,
      UItypes: {
        data: {
          name: "Member Data",
          preview: "`Name: ${option.data.dataName}`",
          data: { dataName: "" },
          UI: [
            {
              element: "input",
              storeAs: "dataName",
              name: "Data Name",
            },
            "-",
            {
              element: "dropdown",
              name: "Control",
              storeAs: "control",
              extraField: "controlValue",
              choices: [
                {
                  name: "Add To Value",
                  placeholder: "Value To Add",
                  field: true,
                },
                { name: "Overwrite", placeholder: "New Value", field: true },
              ],
            },
          ],
        },
      },
    },
  ],

  subtitle: (values, constants, thisAction) => {
    let numData = values.cases.filter((c) => c.type === "data").length;
    let memberValue = constants.user(values.user);
    return `Controlling ${numData} Data(s) of ${memberValue}`;
  },

  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let user = await bridge.getUser(values.user);
    let id = `${user.member.guild.id}${user.id}`;

    for (const dataCase of values.cases) {
      if (dataCase.type !== "data") continue;

      let dataName = bridge.transf(dataCase.data.dataName);
      let control = dataCase.data.control;
      let controlValue = bridge.transf(dataCase.data.controlValue);

      if (!storedData.members[id]) {
        storedData.members[id] = {};
      }

      let userData = storedData.members[id][dataName];

      if (control === "Add To Value") {
        if (
          userData !== undefined &&
          !isNaN(userData) &&
          !isNaN(controlValue)
        ) {
          userData = Number(userData) + Number(controlValue);
        } else {
          userData = controlValue;
        }
      } else {
        userData = controlValue;
      }

      storedData.members[id][dataName] = userData;
    }

    await bridge.data.IO.write(storedData);
  },
};
