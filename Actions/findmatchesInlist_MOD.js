modVersion = "v1.0.0";

module.exports = {
  category: "Lists",
  data: {
    name: "Find Matches In List",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "var",
      name: "List",
      storeAs: "list"
    },
    "-",
    {
      element: "var",
      name: "List check",
      storeAs: "compareValues"
    },
    "-",
    {
      element: "store",
      name: "Matching",
      storeAs: "matching"
    },
    "-",
    {
      element: "store",
      name: "NonMatching",
      storeAs: "nonMatching"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (data, constants) => {
    let variable = constants.variable(data.list);
    let variable1 = constants.variable(data.compareValues);

    return `Checking ${variable} in ${variable1}`

  },

  async run(values, message, client, bridge) {
const compareValues = bridge.get(values.comparelist);
const list = bridge.get(values.list);

const checkCondition = (item) => {
  return compareValues.includes(item);
};

const matching = list.filter(item => checkCondition(item));
const nonMatching = list.filter(item => !checkCondition(item));

bridge.store(values.matching, matching)
bridge.store(values.nonMatching, nonMatching)
  },
};
