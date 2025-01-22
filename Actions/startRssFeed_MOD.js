module.exports = {
  modules: ["feed-watcher"],
  data: {
    name: "Start RSS Feed",
  },
  category: "RSS",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  UI: [
    {
      element: "input",
      name: "RSS/Feed Url",
      placeholder: "You need to use https",
      storeAs: "rssurl",
    },
    "-",
    {
      element: "input",
      name: "Check Interval",
      placeholder: "30",
      storeAs: "checkinterval",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Entry As",
      storeAs: "store",
    },
    "-",
    {
      element: "actions",
      name: "Actions to run when new entry found",
      storeAs: "actions",
      large: true,
    },
  ],
  async run(values, message, client, bridge) {
    const feed = bridge.transf(values.rssurl);
    const interval = bridge.transf(values.checkinterval);
    const Watcher = await client.getMods().require("feed-watcher");

    // if not interval is passed, 60s would be set as default interval.
    const watcher = new Watcher(feed, interval);

    // Check for new entries every n seconds.
    watcher.on("new entries", function (entries) {
      entries.forEach(function (entry) {
        bridge.store(values.store, entry);
        bridge.runner(values.actions);
      });
    });
    // Start watching the feed.
    watcher
      .start()
      .then(function (entries) {
        console.log(`Started watching the feed : ${feed}`);
      })
      .catch(function (error) {
        console.error(error);
      });
  },
};
