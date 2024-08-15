module.exports = {
  data: {
    name: "Get Member Multi Datas",
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
              name: "Get Member Data",
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store As",
            },
          ],
        },
      },
    },
  ],

  subtitle: (values, constants, thisAction) => {
    let numData = values.cases.filter((c) => c.type === "data").length;
    let memberValue = constants.user(values.user);
    return `Getting ${numData} Data(s) of ${memberValue}`;
  },

  async run(values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let user = await bridge.getUser(values.user);
    let id = `${user.member.guild.id}${user.id}`;

    for (const dataCase of values.cases) {
      if (dataCase.type !== "data") continue;

      let userData =
        storedData.members[id][bridge.transf(dataCase.data.dataName)] || "";

      if (dataCase.data.defaultValue) {
        userData = bridge.transf(dataCase.data.defaultValue);
      }

      bridge.store(dataCase.data.store, userData);
    }
  },
};
