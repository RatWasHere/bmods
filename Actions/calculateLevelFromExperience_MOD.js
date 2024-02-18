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
            placeholder: "Example : 100",
        },
        "-",
        {
            element: "input",
            storeAs: "experienceMultiplier",
            name: "Experience Multiplier",
            placeholder: "Example : 1.5",
        },
        "-",
        {
            element: "text",
            text: "The higher the number entered, the more difficult each level becomes."
        },
        "-",
        {
            element: "storageInput",
            storeAs: "store",
            name: "Store calculated level as",
        },
    ],

    async run(values, interaction, client, bridge) {
        // Function to calculate level based on experience
        function calculateLevel(experience) {
            // Experience required for the first level
            const initialExperience = bridge.transf(values.initialExperience);

            // Experience multiplier for each subsequent level
            const experienceMultiplier = bridge.transf(values.experienceMultiplier);

            // Calculate the level
            let level = 1;
            let requiredExperience = initialExperience;

            while (experience >= requiredExperience) {
                experience -= requiredExperience;
                requiredExperience *= experienceMultiplier;
                level++;
            }

            return level - 1; // Return level - 1 because the loop adds 1 extra level
        }

        const experience = bridge.transf(values.experience);
        const level = calculateLevel(experience);
        bridge.store(values.store, level);

    },
};

