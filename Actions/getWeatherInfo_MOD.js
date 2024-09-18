/*
  Get Weather Info mod by candiedapple
  Licensed under MIT License
*/

module.exports = {
  modules: ["weather-js"],
  data: {
    name: "Get Weather Info",
  },
  category: "WebAPIs",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      storeAs: "location",
      name: "Location",
      placeholder: "You can use lat, long | City Name etc",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "degreetype",
      name: "Degree Type",
      choices: [{ name: "C" }, { name: "F" }],
    },
    "-",
    {
      element: "storageInput",
      storeAs: "temperature",
      name: "Store temperature as",
    },
    {
      element: "storageInput",
      storeAs: "skytext",
      name: "Store skytext as",
    },
    {
      element: "storageInput",
      storeAs: "observationpoint",
      name: "Store observationpoint as",
    },
    {
      element: "storageInput",
      storeAs: "feelslike",
      name: "Store feelslike as",
    },
    {
      element: "storageInput",
      storeAs: "humidity",
      name: "Store humidity as",
    },
    {
      element: "storageInput",
      storeAs: "winddisplay",
      name: "Store winddisplay as",
    },
    {
      element: "storageInput",
      storeAs: "windspeed",
      name: "Store windspeed as",
    },
    {
      element: "storageInput",
      storeAs: "imageUrl",
      name: "Store imageUrl as",
    },
  ],

  async run(values, client, interaction, bridge) {
    return new Promise((resolve, reject) => {
      var weather = require("weather-js");

      const location = bridge.transf(values.location);
      const typeofdegree = bridge.transf(values.degreetype);

      weather.find(
        { search: location, degreeType: typeofdegree },
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            bridge.store(values.temperature, result[0].current.temperature);
            bridge.store(values.skytext, result[0].current.skytext);
            bridge.store(
              values.observationpoint,
              result[0].current.observationpoint
            );
            bridge.store(values.feelslike, result[0].current.feelslike);
            bridge.store(values.humidity, result[0].current.humidity);
            bridge.store(values.winddisplay, result[0].current.winddisplay);
            bridge.store(values.windspeed, result[0].current.windspeed);
            bridge.store(values.imageUrl, result[0].current.imageUrl);

            resolve();
          }
        }
      );
    });
  },
};
