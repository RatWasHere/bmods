/*
A mod for convert 1d 1h 1m 1s to seconds
*/
modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Convert dhms to seconds",
  },
  category: "Numbers",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "input",
      name: "Time (1d 1h 1m 1s)",
      storeAs: "time"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  subtitle: (data, constants) => {
    return `${data.time} Convert to seconds - Store As ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
      
      let timeString = bridge.transf(values.time);
      
      const str = timeString.trim().toLowerCase();
      
      if (!str) {
          var result = 0;
      } else {
          const dayMatch = str.match(/(\d+)d/);
          const hourMatch = str.match(/(\d+)h/);
          const minuteMatch = str.match(/(\d+)m/);
          const secondMatch = str.match(/(\d+)s/);
          
          const cleaned = str.replace(/(\d+d|\d+h|\d+m|\d+s)/g, '').trim();
          
          if (cleaned !== '') {
              var result = 0;
          } else {
              const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
              const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
              const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
              const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;
              
              if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                  var result = 0;
              } else {
                  var result = days * 86400 + hours * 3600 + minutes * 60 + seconds;
              }
          }
      }
      
      bridge.store(values.store, result)
  },
};
