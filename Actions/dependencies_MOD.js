const Mods = {
  installModule(moduleName, version) {
    return new Promise((resolve) => {
      try {
        require("child_process").execSync(
          `npm i ${version ? `${moduleName}@${version}` : moduleName}`
        );
        return resolve(require(moduleName));
      } catch (error) {
        return console.log(
          `The required module "${
            version ? `${moduleName}@${version}` : moduleName
          }" has been installed. Please restart your bot.`
        );
      }
    });
  },

  require(moduleName, version) {
    try {
      return require(moduleName);
    } catch (e) {
      this.installModule(moduleName, version);
      return require(moduleName);
    }
  },
};

module.exports = {
  data: {
    name: "Dependencies",
  },
  UI: [],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat, TheMonDon",
  },
  compatibility: ["Any"],
  subtitle: "This is required in an on bot ready event for mods",

  startup: (bridge, client) => {
    client.getMods = function getMods() {
      return Mods;
    };
  },
};
