module.exports = {
  category: "Lists",
  data: {
    name: "Check Item From List",
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
      element: "halfDropdown",
      storeAs: "comparator",
      extraField: "compareValue",
      name: "Comparison Type",
      choices: [
        {
          name: "The same as",
          field: true,
          placeholder: "The same as",
        },
        {
          name: "Include",
          field: true,
        },
        {
          name: "Matches the regular expression",
          field: true,
          placeholder: "Regex"
        },
        {
          name: "The length is longer than",
          field: true,
        },
        {
          name: "The length is less than",
          field: true
        },
        {
          name: "The length is",
          field: true
        },
        {
          name: "It starts with",
          field: true
        },
        {
          name: "Ends with",
          field: true
        },
        {
          name: "Less than [Only the numbers in the list are required]",
          field: true
          
        },
        {
          name: "Less than or equal to [Requires only numbers in the list]",
          field: true,
        },
        {
          name: "More than [Only the numbers in the list are required]",
          field: true,
        },
        {
          name: "Greater than or equal to [Requires only numbers in the list]",
          field: true,
        }
      ]
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    }
  ],

  subtitle: (data, constants) => {
    let variable = constants.variable(data.list);

    switch (data.comparator) {
      case 'The same as':
        return `Checking by The same as "${data.compareValue}" in ${variable}`;
        break

      case 'Include':
        return `Checking by Include "${data.compareValue}" in ${variable}`;
        break

      case 'Matches the regular expression':
        return `Checking by regular expression "${data.compareValue}" in ${variable}`;
        break

      case 'Less than [Only the numbers in the list are required]':
        return `Checking by Less than "${data.compareValue}" in ${variable}`
        break

      case 'Less than or equal to [Requires only numbers in the list]':
        return `Checking by Less than "${data.compareValue}" in ${variable}`
        break

      case 'More than [Only the numbers in the list are required]':
        return `Checking by More than "${data.compareValue}" in ${variable}`
        break

      case 'Greater than or equal to [Requires only numbers in the list]':
        return `Checking by Greater than or equal to "${data.compareValue}" in ${variable}`
        break

      case 'The length is longer than':
        return `Checking by The length is longer than "${data.compareValue}" in ${variable}`
        break

      case 'The length is less than':
        return `Checking by The length is less than "${data.compareValue}" in ${variable}`
        break

      case 'The length is':
        return `Checking by The length is "${data.compareValue}" in ${variable}`
        break

      case 'It starts with':
        return `Checking by It starts with "${data.compareValue}" in ${variable}`
        break

      case 'Ends with':
        return `Checking by Ends with "${data.compareValue}" in ${variable}`
        break
    }
  },

  async run(values, message, client, bridge) {
    let matchesCriteria;

    let item = bridge.transf(values.compareValue);
    let list = bridge.get(values.list);

    switch (values.comparator) {
      case "The same as":
        matchesCriteria = list.findIndex((i) => i === item);
        break;

      case "Include":
        matchesCriteria = list.findIndex((i) => i.includes(item));
        break;

      case "Matches the regular expression":
        matchesCriteria = list.findIndex((i) => Boolean(i.match(new RegExp('^' + item + '$', 'i'))));
        break;

      case "Less than [Only the numbers in the list are required]":
        matchesCriteria = list.findIndex((i) => i < item);
        break;

      case "Less than or equal to [Requires only numbers in the list]":
        matchesCriteria = list.findIndex((i) => i <= item);
        break;

      case "More than [Only the numbers in the list are required]":
        matchesCriteria = list.findIndex((i) => i > item);
        break;

      case "Greater than or equal to [Requires only numbers in the list]":
        matchesCriteria = list.findIndex((i) => i >= item);
        break;

      case "The length is longer than":
        matchesCriteria = list.findIndex((i) => Boolean(i.length > item));
        break;

      case "The length is less than":
        matchesCriteria = list.findIndex((i) => Boolean(i.length < item));
        break;

      case "The length is":
        matchesCriteria = list.findIndex((i) => Boolean(i.length == item));
        break;

      case "It starts with":
        matchesCriteria = list.findIndex((i) => i.startsWith(item));
        break;

      case "Ends with":
        matchesCriteria = list.findIndex((i) => i.endsWith(item));
        break;
    }

    if (parseInt(matchesCriteria) >= 0) {
      matchesCriteria = true
    } else {
      matchesCriteria = false
    }

    if (matchesCriteria) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
