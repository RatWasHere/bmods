/*
  Generate PetPet Gif mod by candiedapple
  Licensed under MIT License

  Generates a petpet gif from an Image
*/

module.exports = {
  modules: ["petpet-gen"],
  data: {
    name: "Generate PetPet Gif",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  category: "Images",
  UI: [
    {
      element: "input",
      storeAs: "url",
      name: "Image URL",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store generated gif As",
    },
  ],

  run(values, interaction, client, bridge) {
    return new Promise((resolve, reject) => {
      const generateGif = require("petpet-gen");

      // Define the URL of the avatar image you want to use
      const avatarURL = bridge.transf(values.url);

      // Define options for generating the GIF (optional)
      const options = {
        resolution: 128,
        delay: 20,
        backgroundColor: null,
      };

      // Call the generateGif function with the avatar URL and options
      generateGif(avatarURL, options)
        .then((gifData) => {
          // Now you can use the generated GIF data as needed
          bridge.store(values.store, gifData);
          resolve(gifData); // Resolve the promise with the generated GIF data
        })
        .catch((error) => {
          // Handle any errors that occur during GIF generation
          console.error("Error generating GIF:", error);
          reject(error); // Reject the promise with the error
        });
    });
  },
};
