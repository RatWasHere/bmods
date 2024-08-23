module.exports = {
  data: {
    name: "Expired Timestamps Checker",
  },
  category: "Dates",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      name: "ISO Timestamps",
      placeholder: "Example: 2023-01-01T00:00:00.000Z,2022-01-01T00:00:00.000Z - Seperate with commas",
      storeAs: "isotimestamps",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Past Timestamps As",
      storeAs: "store",
    },
    "-",
    {
      element: "actions",
      name: "Actions to run when the timestamps are in the past",
      storeAs: "actions",
      large: true,
    },
  ],
  async run(values, message, client, bridge) {

    
    // Function to compare timestamps
    function compareTimestamps(inputTimestamps) {
      // Split the input string into an array of timestamps
      const timestampsArray = inputTimestamps.split(',');

      // Get the current timestamp
      const currentTimestamp = new Date();

      // Iterate over each input timestamp
      timestampsArray.forEach(inputTimestamp => {
      // Parse the input timestamp
      const inputDate = new Date(inputTimestamp.trim());

      // Compare the timestamps
      if (inputDate < currentTimestamp) {
        bridge.store(values.store, inputTimestamp);
        bridge.runner(values.actions);  
      } else {
        //console.log(`The input timestamp ${inputTimestamp} is in the future.`);
      }
      });
    }

    // Call the compareTimestamps function with the provided input
    compareTimestamps(values.isotimestamps);

  },
};