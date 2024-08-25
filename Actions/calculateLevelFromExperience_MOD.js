/*
  Calculate Level From Experience Mod by candiedapple
  Licensed under MIT License

  For support ping me on BMD Discord server.
*/

module.exports = {
  data: {
    name: "Calculate Level From Experience",
  },
  category: "Numbers",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      storeAs: "experience",
      name: "Experience To Calculate",
    },
    "-",
    {
      element: "input",
      storeAs: "initialExperience",
      name: "Required Experience For The First Level",
      placeholder:
        "Recommended: 100 - Always use the same value for all actions",
    },
    "-",
    {
      element: "input",
      storeAs: "experienceMultiplier",
      name: "Experience Multiplier",
      placeholder:
        "Recommended: 2 (Note: always use the same value for all actions)",
    },
    "_",
    {
      element: "text",
      text: "The higher the number entered, the more difficult each level becomes.",
    },
    "-",
    {
      element: "input",
      storeAs: "levelbarempty",
      name: "Empty Level Bar Character",
      placeholder: "Example: = -  Leave blank for none...",
    },
    "-",
    {
      element: "input",
      storeAs: "levelbarfilled",
      name: "Filled Level Bar Character",
      placeholder: "Example: # - Leave blank for none...",
    },
    "-",
    {
      element: "input",
      storeAs: "levelbarlenght",
      name: "Level Bar Lenght",
      placeholder: "Default: 10 - Leave blank for default...",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "userLevel",
      name: "Store Calculated Level As",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "currentLevelProgress",
      name: "Store Experience Gained Towards The Next Level As",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "requiredexp",
      name: "Store Required Experience For The Next Level As",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "levelbar",
      name: "Store Generated Level Bar As",
    },
    "_",
    {
      element: "text",
      text: "Leave Blank If You Don't Want To Use The Level Bar...",
    },
  ],

  async run(values, interaction, client, bridge) {
    const levelbarempty = bridge.transf(values.levelbarempty);
    const levelbarfilled = bridge.transf(values.levelbarfilled);
    const base = bridge.transf(values.initialExperience);
    const exponent = bridge.transf(values.experienceMultiplier);

    // Function to determine user level based on experience
    function getUserLevel(experience) {
      return Math.floor(Math.pow(experience / base, 1 / exponent)) + 1;
    }

    // Function to generate emoji level bar based on experience
    function generateLevelBar(experience) {
      const currentLevel = getUserLevel(experience);
      const nextLevel = currentLevel + 1;
      const currentLevelExperience =
        Math.pow(currentLevel - 1, exponent) * base;
      const nextLevelExperience = Math.pow(currentLevel, exponent) * base;
      const totalChars = bridge.transf(values.levelbarlenght) || 10;
      const filledChars = Math.floor(
        (experience - currentLevelExperience) /
          ((nextLevelExperience - currentLevelExperience) / totalChars)
      );
      const emptyChars = totalChars - filledChars;
      const levelBar =
        levelbarfilled.repeat(filledChars) + levelbarempty.repeat(emptyChars);
      const currentLevelProgress = experience - currentLevelExperience;
      return { currentLevel, nextLevel, levelBar, nextLevelExperience, currentLevelProgress };
    }

    // Assuming you have a variable named 'experience'
    const experience = bridge.transf(values.experience);

    // Get the user level and print it to the console
    const userLevel = getUserLevel(experience);

    // Get the current level, next level, and emoji level bar, then store them
    const { currentLevel, nextLevel, levelBar, nextLevelExperience, currentLevelProgress } =
      generateLevelBar(experience);

    const requiredexperience = nextLevelExperience - experience;

    bridge.store(values.userLevel, userLevel);
    bridge.store(values.levelbar, levelBar);
    bridge.store(values.requiredexp, requiredexperience);
    bridge.store(values.currentLevelProgress, currentLevelProgress);
  },
};