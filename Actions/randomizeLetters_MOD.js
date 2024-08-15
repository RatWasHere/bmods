module.exports = {
  data: {
    name: "Randomize Letters",
  },
  category: "Text",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "nitiqt",
  },
  UI: [
    {
      element: "input",
      storeAs: "length",
      name: "Word Length",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "lowercase",
      name: "Lowercase Alpha Characters (abcdefghijklmnopqrstuvwxyz)",
      choices: {
        false: { name: "False" },
        true: { name: "True" },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "uppercase",
      name: "Uppercase Alpha Characters (ABCDEFGHIJKLMNOPQRSTUVWXYZ)",
      choices: {
        false: { name: "False" },
        true: { name: "True" },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "numeric",
      name: "Numeric Characters (0123456789)",
      choices: {
        false: { name: "False" },
        true: { name: "True" },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "special",
      name: "Special Characters (!@#$%^&*()_+)",
      choices: {
        false: { name: "False" },
        true: { name: "True" },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "custom",
      name: "Custom Characters",
      choices: {
        false: { name: "False" },
        true: { name: "True", field: true },
      },
    },
    "-",
    {
      element: "storageInput",
      storeAs: "letters",
      name: "Store Letters As",
    },
  ],

  subtitle: (values, constants) => {
    const length = values.length || "Default";
    let subtitleParts = [];

    if (values.lowercase.type === "true") {
      subtitleParts.push("Lowercase");
    }
    if (values.uppercase.type === "true") {
      subtitleParts.push("Uppercase");
    }
    if (values.numeric.type === "true") {
      subtitleParts.push("Numeric");
    }
    if (values.special.type === "true") {
      subtitleParts.push("Special");
    }
    if (
      values.custom.type === "true" &&
      values.custom.value &&
      values.custom.value.trim() !== ""
    ) {
      subtitleParts.push(`Custom (${values.custom.value})`);
    }

    let subtitle = `Generate ${length} letter(s) with: `;
    if (subtitleParts.length > 0) {
      subtitle += subtitleParts.join(", ");
    } else {
      subtitle += "No characters selected";
    }

    if (
      values.letters &&
      values.letters.value &&
      values.letters.value.trim() !== ""
    ) {
      subtitle += ` - Store As: ${constants.variable(values.letters)}`;
    }

    return subtitle;
  },

  async run(values, client, message, bridge) {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericChars = "0123456789";
    const specialChars = "!@#$%^&*()_+";
    let allChars = "";

    if (values.lowercase.type === "true") {
      allChars += lowercaseChars;
    }
    if (values.uppercase.type === "true") {
      allChars += uppercaseChars;
    }
    if (values.numeric.type === "true") {
      allChars += numericChars;
    }
    if (values.special.type === "true") {
      allChars += specialChars;
    }
    if (
      values.custom.type === "true" &&
      values.custom.value &&
      values.custom.value.trim() !== ""
    ) {
      allChars += values.custom.value;
    }

    if (allChars === "") {
      allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;
    }

    const length = parseInt(values.length, 10) || 10;
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      result += allChars.charAt(randomIndex);
    }

    bridge.store(values.letters, result);
  },
};
