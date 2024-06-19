module.exports = {
  category: "Control",
  data: { name: "Wait" },
  UI: [
    {
      element: "dropdown",
      storeAs: "timeUnit",
      extraField: "time",
      name: "Amount Of Time",
      choices: [
      {
        name: "Milliseconds",
        field: true
        },
        {
          name: "Seconds",
          field: true
        },
        {
          name: "Minutes",
          field: true
        },
        {
          name: "Hours",
          field: true
        },
      ]
    } 
  ],
  subtitle: "Amount Of Time: $[time]$ $[timeUnit]$",
  async run(values, message, client, bridge) {
    function wait(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      });
    }
    var timeAmount = parseInt(bridge.transf(values.time));
    let time;
    switch (values.timeUnit) {
      case "Milliseconds":
        time = timeAmount;
        break;
      case "Seconds":
        time = 1000 * timeAmount;
        break;
      case "Minutes":
        time = 1000 * 60 * timeAmount;
        break;
      case "Hours":
        time = 1000 * 60 * 60 * timeAmount;
        break;
    }

    function wait() {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }

    await wait(time);
  },
};
