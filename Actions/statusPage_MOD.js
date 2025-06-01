modVersion = "s.v3.0";

module.exports = {
  data: {
    name: "Create Status Page",
    host: "localhost",
    port: "3000",
    graphHistoryCount: 60,
    consoleHistoryCount: 1000,
    interval: 2.5,
    theme: "default",
  },
  aliases: ["Status Page", "Web UI"],
  modules: [
    "node:http",
    "node:os",
    "node:fs",
    "node:path",
    "node:url",
    "node:https",
    "node:crypto",
  ],
  category: "Utilities",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia & qizzle",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "host",
      name: "Host",
      placeholder: "0.0.0.0 (Available On Local Network)",
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port",
    },
    "-",
    {
      element: "input",
      storeAs: "username",
      name: "Login Username (Optional, defaults to: user)",
    },
    {
      element: "input",
      storeAs: "password",
      name: "Login Password (Optional, defaults to: password)",
    },
    {
      element: "typedDropdown",
      storeAs: "loginSystem",
      name: "Login System",
      choices: {
        basic: { name: "Basic Login | Shows A Pop-up Panel", field: false },
        token: {
          name: "Token Login | Uses Cookies (May Not Work On Some Browsers)",
          field: false,
        },
      },
    },
    "-",
    {
      element: "input",
      storeAs: "graphHistoryCount",
      name: "Graph History Count",
      placeholder: 60,
    },
    {
      element: "input",
      storeAs: "consoleHistoryCount",
      name: "Console History Count",
      placeholder: 1000,
    },
    {
      element: "input",
      storeAs: "interval",
      name: "Update Interval (In Seconds)",
      placeholder: 5,
    },
    "-",
    {
      element: "input",
      storeAs: "theme",
      name: "Theme",
      placeholder: "default",
    },
    {
      element: "text",
      text: `<div style="text-align=left">
      Check Out Available Themes On GitHub
      <button class="hoverablez" style="width: fit-content;" onclick="require('electron').shell.openExternal('https://github.com/slothyace/bmd-statusPage/tree/main/themes')">
      <btext>Explore Themes</btext>
      </button>
      </div>`,
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Create Status Page View On ${values.host}:${values.port}`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName);
    }

    // Modules
    const http = require("node:http");
    const https = require("node:https");
    const os = require("node:os");
    const path = require("node:path");
    const fs = require("node:fs");
    const crypto = require("node:crypto");
    const oceanic = require("oceanic.js");

    // Service
    const host = bridge.transf(values.host) || "0.0.0.0";
    const port = parseInt(bridge.transf(values.port), 10) || 3000;

    // Credentials
    const username = bridge.transf(values.username) || "user";
    const password = bridge.transf(values.password) || "password";
    const loginSystem = bridge.transf(values.loginSystem.type) || "basic";

    // Configs
    const graphHistoryCount =
      parseInt(bridge.transf(values.graphHistoryCount)) || 60;
    const logsHistoryCount =
      parseInt(bridge.transf(values.consoleHistoryCount)) || 100;
    const interval = parseFloat(bridge.transf(values.interval)) * 1000 || 5000;
    const theme = bridge.transf(values.theme) || "default";

    // Data Fetching
    const botData = require("../data.json");
    const appName = botData.name || "NodeJS";
    const workingDir = path.normalize(process.cwd());
    const botStartTimestamp = new Date();

    // Directory Definitions
    let workingPath;
    if (workingDir.includes(path.join("common", "Bot Maker For Discord"))) {
      workingPath = botData.prjSrc;
    } else {
      workingPath = workingDir;
    }

    let loginHtmlFilePath = path.join(workingPath, "statusPage", "login.html");
    let htmlFilePath = path.join(
      workingPath,
      "statusPage",
      "themes",
      theme,
      "index.html"
    );
    let icoFilePath = path.join(
      workingPath,
      "statusPage",
      "themes",
      theme,
      "bmd.ico"
    );
    let cssFilePath = path.join(
      workingPath,
      "statusPage",
      "themes",
      theme,
      "style.css"
    );
    let statusPageThemeDir = path.join(
      workingPath,
      "statusPage",
      "themes",
      theme
    );
    if (!fs.existsSync(statusPageThemeDir)) {
      fs.mkdirSync(statusPageThemeDir, { recursive: true });
    }

    // Getting Files From GitHub If They Dont Exist
    let siteFiles;
    if (loginSystem === "basic") {
      siteFiles = {
        html: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/index.html`,
          path: htmlFilePath,
          name: `index.html`,
        },
        ico: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/bmd.ico`,
          path: icoFilePath,
          name: `bmd.ico`,
        },
        css: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/style.css`,
          path: cssFilePath,
          name: `style.css`,
        },
      };
    } else if (loginSystem === "token") {
      siteFiles = {
        login: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/core/login.html`,
          path: loginHtmlFilePath,
          name: `login.html`,
        },
        html: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/index.html`,
          path: htmlFilePath,
          name: `index.html`,
        },
        ico: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/bmd.ico`,
          path: icoFilePath,
          name: `bmd.ico`,
        },
        css: {
          github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/themes/${theme}/style.css`,
          path: cssFilePath,
          name: `style.css`,
        },
      };
    }
    for (let coreKey in siteFiles) {
      const file = siteFiles[coreKey];

      if (!fs.existsSync(file.path)) {
        console.log(
          `Missing "${file.name}" in ${file.path}, downloading from GitHub.`
        );

        try {
          await new Promise((resolve, reject) => {
            https
              .get(file.github, (response) => {
                if (response.statusCode !== 200) {
                  reject(
                    new Error(
                      `Failed to download "${file.name}" from GitHub. Status Code: ${response.statusCode}`
                    )
                  );
                  return;
                }

                const chunks = [];

                response.on("data", (chunk) => chunks.push(chunk));

                response.on("end", () => {
                  try {
                    const data = Buffer.concat(chunks);
                    fs.writeFileSync(file.path, data); // No encoding specified so it works for binary too
                    console.log(
                      `"${file.name}" downloaded from ${file.github}.`
                    );
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                });
              })
              .on("error", (err) => {
                reject(err);
              });
          });
        } catch (err) {
          console.error(
            `Error while downloading "${file.name}" from GitHub:`,
            err
          );
        }
      }
    }

    // Cpu Usage
    let lastCpuUsage = process.cpuUsage();
    let lastCpuTime = process.hrtime();
    function getProcessCpuPercent() {
      const currentCpu = process.cpuUsage(lastCpuUsage);
      const currentTime = process.hrtime(lastCpuTime);
      lastCpuUsage = process.cpuUsage();
      lastCpuTime = process.hrtime();
      const elapsedMicroSeconds = currentTime[0] * 1e6 + currentTime[1] / 1000;
      const totalCpuUsage = currentCpu.user + currentCpu.system;
      return ((totalCpuUsage / elapsedMicroSeconds) * 100).toFixed(2);
    }

    // Ram Usage
    function getProcessRamMb() {
      return (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
    }

    // Commands
    let slashCommands = [];
    let textCommands = [];
    let msgCommands = [];
    let userCommands = [];
    let events = [];
    let msgContentCommands = [];
    let anyMessageCommands = [];
    const commands = botData.commands;
    commands.forEach((command) => {
      switch (command.trigger) {
        case "slashCommand":
          slashCommands.push(command.customId);
          break;

        case "textCommand":
          textCommands.push(command.customId);
          break;

        case "event":
          events.push(command.customId);
          break;

        case "message":
          msgCommands.push(command.customId);
          break;

        case "user":
          userCommands.push(command.customId);
          break;

        case "msgContent":
          msgContentCommands.push(command.customId);
          break;

        case "anyMessage":
          anyMessageCommands.push(command.customId);
      }
    });

    // Client Info
    let guildCount = client.guilds.size;
    let userCount = client.users.size;
    let nodeJsVer = process.versions.node;
    let ocncJsVer = oceanic.Constants.VERSION;

    // Creating Data For Graphs
    let dataHistory = [];
    function updateStats() {
      const cpuUsagePercent = getProcessCpuPercent();
      const ramUsageMb = getProcessRamMb();
      const timestamp = new Date();
      if (dataHistory.length >= graphHistoryCount) {
        dataHistory.shift();
      }
      dataHistory.push({
        timestamp,
        cpu: cpuUsagePercent,
        memory: ramUsageMb,
        counts: {
          guild: guildCount,
          users: userCount,
        },
      });
    }

    // Logging System
    let logHistory = [];

    function createLogs(logHistory, maxLength = logsHistoryCount) {
      const consoleMethods = {
        error: console.error,
        warn: console.warn,
        log: console.log,
      };

      Object.entries(consoleMethods).forEach(([type, originalFn]) => {
        console[type] = (...args) => {
          const fullMsg = args
            .map((arg) => {
              if (arg instanceof Error) {
                return arg.stack;
              }
              if (typeof arg === "object") {
                return JSON.stringify(arg, null, 2);
              }
              return String(arg);
            })
            .join(" ");

          logHistory.push({
            msg: fullMsg,
            timestamp: new Date(),
            type,
          });

          if (logHistory.length > maxLength) {
            logHistory.shift();
          }

          originalFn(...args);
        };
      });
    }
    createLogs(logHistory, logsHistoryCount);

    setInterval(updateStats, interval);
    updateStats();

    // Basic Authorization Method
    function checkAuthorization(request) {
      if (!password) {
        return true;
      }
      const auth = request.headers.authorization;
      if (!auth || !auth.startsWith("Basic ")) {
        return false;
      }
      const [loginUser, loginPassword] = Buffer.from(
        auth.split(" ")[1],
        "base64"
      )
        .toString()
        .split(":");
      return loginUser === username && loginPassword === password;
    }

    // Token Authorization Method
    let activeTokens = [];
    function checkToken(request) {
      let cookieHeader = request.headers.cookie || "";
      let cookies = Object.fromEntries(
        cookieHeader.split(";").map((cookie) => {
          let [key, value] = cookie.trim().split("=");
          return [key, value];
        })
      );

      let token = cookies.spToken;
      if (activeTokens.includes(token) === true) {
        return true;
      } else {
        return false;
      }
    }

    // Checking For Missing Files
    let missingSiteFiles = [];
    for (let key in siteFiles) {
      const file = siteFiles[key];
      if (!fs.existsSync(file.path)) {
        missingSiteFiles.push(file.name);
      }
    }
    if (missingSiteFiles.length > 0) {
      return console.error(
        `Files (${missingSiteFiles.join(", ")}) Are Missing To Serve The Page!`
      );
    }

    const server = http.createServer((request, response) => {
      let endPoint = request.url;
      if (loginSystem === "basic") {
        if (!checkAuthorization(request)) {
          response.writeHead(401, {
            "www-authenticate": `Basic realm="Process Monitor"`,
          });
          return response.end("Unauthorized");
        }
      }

      switch (endPoint) {
        case "/favicon.ico":
          if (fs.existsSync(icoFilePath)) {
            response.writeHead(200, {
              "content-type": "image/x-icon",
            });
            fs.createReadStream(icoFilePath).pipe(response);
          } else {
            response.writeHead(404);
            response.end("Favicon Not Found!");
          }
          break;

        case "/style.css":
          if (fs.existsSync(cssFilePath)) {
            response.writeHead(200, {
              "content-type": "text/css",
            });
            fs.createReadStream(cssFilePath).pipe(response);
          } else {
            response.writeHead(404);
            response.end("Style.css Not Found!");
          }
          break;

        case "/":
          response.writeHead(301, { location: "/monitor" });
          response.end();
          break;

        case "/login":
          if (loginSystem === "token") {
            if (request.method === "GET") {
              response.writeHead(200, {
                "content-type": "text/html",
              });
              let loginPageHtml = fs.readFileSync(loginHtmlFilePath, "utf-8");
              response.end(loginPageHtml);
            } else if (request.method === "POST") {
              let postBody = "";
              request.on("data", (dataChunk) => (postBody += dataChunk));
              request.on("end", () => {
                postBody = JSON.parse(postBody);
                let loginUsername = postBody.username;
                let loginPassword = postBody.password;
                if (loginUsername === username && loginPassword === password) {
                  const newToken = crypto.randomBytes(32).toString("hex");
                  activeTokens.push(newToken);
                  response.writeHead(302, {
                    "content-type": "application/json",
                    "set-cookie": `spToken=${newToken}; HttpOnly; Path=/; SameSite=Lax`,
                    location: "/monitor",
                  });
                  response.end(JSON.stringify({ success: true }, null, 2));
                } else {
                  response.writeHead(401, {
                    "content-type": "application/json",
                  });
                  response.end(
                    JSON.stringify(
                      { success: false, error: "Invalid Login" },
                      null,
                      2
                    )
                  );
                }
              });
            }
          } else if (loginSystem === "basic") {
            response.writeHead(301, { location: "/monitor" });
            response.end();
          }
          break;

        case "/monitor":
          if (loginSystem === "token") {
            let monitorAuthorized = checkToken(request);
            if (monitorAuthorized == false) {
              response.writeHead(301, { location: "/login" });
              response.end();
            } else {
              response.writeHead(200, {
                "content-type": "text/html",
              });
              let htmlTemplate = fs.readFileSync(htmlFilePath, "utf-8");
              response.end(htmlTemplate);
            }
          } else if (loginSystem === "basic") {
            response.writeHead(200, {
              "content-type": "text/html",
            });
            let htmlTemplate = fs.readFileSync(htmlFilePath, "utf-8");
            response.end(htmlTemplate);
          }
          break;

        case "/raw":
          if (loginSystem === "token") {
            let rawAuthorized = checkToken(request);
            if (rawAuthorized == false) {
              response.writeHead(301, { location: "/login" });
              response.end();
            } else {
              response.writeHead(200, {
                "content-type": "application/json",
              });
              response.end(
                JSON.stringify(
                  {
                    prjName: appName,
                    data: dataHistory,
                    updInterval: interval,
                    uptime: process.uptime(),
                    startTime: botStartTimestamp,
                    logs: logHistory,
                    commands: {
                      slashCmd: slashCommands.length,
                      textCmd: textCommands.length,
                      msgCmd: msgCommands.length,
                      userCmd: userCommands.length,
                      msgCntCmd: msgContentCommands.length,
                      anyMsgCmd: anyMessageCommands.length,
                      event: events.length,
                    },
                    versions: {
                      node: nodeJsVer,
                      oceanic: ocncJsVer,
                    },
                  },
                  null,
                  2
                )
              );
            }
          } else if (loginSystem === "basic") {
            response.writeHead(200, {
              "content-type": "application/json",
            });
            response.end(
              JSON.stringify(
                {
                  prjName: appName,
                  data: dataHistory,
                  updInterval: interval,
                  uptime: process.uptime(),
                  startTime: botStartTimestamp,
                  logs: logHistory,
                  commands: {
                    slashCmd: slashCommands.length,
                    textCmd: textCommands.length,
                    msgCmd: msgCommands.length,
                    userCmd: userCommands.length,
                    msgCntCmd: msgContentCommands.length,
                    anyMsgCmd: anyMessageCommands.length,
                    event: events.length,
                  },
                  versions: {
                    node: nodeJsVer,
                    oceanic: ocncJsVer,
                  },
                },
                null,
                2
              )
            );
          }
          break;

        default:
          response.writeHead(404);
          response.end("Page Not Found!");
          break;
      }
    });

    server.listen(port, host, () => {
      console.log(`Status Page Available At "http://${host}:${port}/monitor"`);
    });
  },
};
