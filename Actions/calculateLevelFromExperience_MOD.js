/*
  Calculate Level From Experience Mod by candiedapple
  Licensed under MIT License

  For support ping me on BMD Discord server.
*/

module.exports = {
    data: {
        name: "Calculate Level From Experience",
    },
    UI: [
        {
            element: "input",
            storeAs: "experience",
            name: "Experience that will be calculated",
        },
        "-",
        {
            element: "input",
            storeAs: "initialExperience",
            name: "Experience required for the first level",
            placeholder: "Recommended : 100 ( Note: always use the same value for all actions)",
        },
        "-",
        {
            element: "input",
            storeAs: "experienceMultiplier",
            name: "Experience Multiplier",
            placeholder: "Recommended : 2 ( Note: always use the same value for all actions)",
        },
        "-",
        {
            element: "text",
            text: "The higher the number entered, the more difficult each level becomes."
        },
        "-",
        {
            element: "input",
            storeAs: "levelbarempty",
            name: "Empty level bar emoji",
            placeholder: "Example : = (Leave blank if you dont wanna use level bar)",
        },
        "-",
        {
            element: "input",
            storeAs: "levelbarfilled",
            name: "Filled level bar emoji",
            placeholder: "Example : # (Leave blank if you dont wanna use level bar)",
        },
        "-",
        {
            element: "storageInput",
            storeAs: "userLevel",
            name: "Store calculated level as",
        },
        "-",
        {
            element: "storageInput",
            storeAs: "requiredexp",
            name: "Store required exp for next level as",
        },
        "-",
        {
            element: "storageInput",
            storeAs: "levelbar",
            name: "Store generated level bar as",
        },
        "-",
        {
            element: "text",
            text: "(Leave blank if you dont wanna use level bar)"
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
            const currentLevelExperience = Math.pow((currentLevel - 1), exponent) * base;
            const nextLevelExperience = Math.pow(currentLevel, exponent) * base;
            const totalChars = 20;
            const filledChars = Math.floor((experience - currentLevelExperience) / ((nextLevelExperience - currentLevelExperience) / totalChars));
            const emptyChars = totalChars - filledChars;
            const levelBar = levelbarfilled.repeat(filledChars) + levelbarempty.repeat(emptyChars);
            return { currentLevel, nextLevel, levelBar, nextLevelExperience };
        }

        // Assuming you have a variable named 'experience'
        const experience = bridge.transf(values.experience);

        // Get the user level and print it to the console
        const userLevel = getUserLevel(experience);

        // Get the current level, next level, and emoji level bar, then store them
        const { currentLevel, nextLevel, levelBar, nextLevelExperience } = generateLevelBar(experience);

        const requiredexperience = nextLevelExperience - experience

        bridge.store(values.userLevel, userLevel);
        bridge.store(values.levelbar, levelBar);
        bridge.store(values.requiredexp, requiredexperience);

    },
};

