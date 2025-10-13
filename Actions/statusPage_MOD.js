modVersion = "v3.0.4";

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
  modules: ["node:http", "node:os", "node:fs", "node:path", "node:url", "node:https", "node:crypto"],
  category: "Utilities",
  modVersion,
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
      placeholder: "localhost",
    },
    {
      element: "input",
      storeAs: "port",
      name: "Port",
      placeholder: "3000",
    },
    "-",
    {
      element: "input",
      storeAs: "username",
      name: "Login Username (Optional, defaults to: user)",
      placeholder: "user",
    },
    {
      element: "input",
      storeAs: "password",
      name: "Login Password (Optional, defaults to: password)",
      placeholder: "password",
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
      placeholder: 2.5,
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
    const host = bridge.transf(values.host) || "localhost";
    const port = parseInt(bridge.transf(values.port), 10) || 3000;

    // Credentials
    const username = bridge.transf(values.username) || "user";
    const password = bridge.transf(values.password) || "password";
    const loginSystem = bridge.transf(values.loginSystem.type) || "basic";

    // Configs
    const graphHistoryCount = parseInt(bridge.transf(values.graphHistoryCount)) || 60;
    const logsHistoryCount = parseInt(bridge.transf(values.consoleHistoryCount)) || 100;
    const interval = parseFloat(bridge.transf(values.interval)) * 1000 || 2500;
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

    let htmlFilePath = path.join(workingPath, "statusPage", "themes", theme, "index.html");
    let icoFilePath = path.join(workingPath, "statusPage", "themes", theme, "bmd.ico");
    let cssFilePath = path.join(workingPath, "statusPage", "themes", theme, "style.css");
    let loginHtmlFilePath = path.join(workingPath, "statusPage", "login.html");
    let statusPageThemeDir = path.join(workingPath, "statusPage", "themes", theme);
    if (!fs.existsSync(statusPageThemeDir)) {
      fs.mkdirSync(statusPageThemeDir, { recursive: true });
    }

    // Getting Files From GitHub If They Dont Exist
    let siteFiles = {
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

    if (loginSystem === "token") {
      siteFiles["login"] = {
        github: `https://raw.githubusercontent.com/slothyace/bmd-statusPage/refs/heads/main/core/login.html`,
        path: loginHtmlFilePath,
        name: `login.html`,
      };
    }

    for (let coreKey in siteFiles) {
      const file = siteFiles[coreKey];

      if (!fs.existsSync(file.path)) {
        console.log(`[Status Page] Missing "${file.name}" in ${file.path}, downloading from GitHub.`);

        try {
          await new Promise((resolve, reject) => {
            https
              .get(file.github, (response) => {
                if (response.statusCode !== 200) {
                  reject(
                    new Error(
                      `[Status Page] Failed to download "${file.name}" from GitHub. Status Code: ${response.statusCode}`
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
                    console.log(`[Status Page] "${file.name}" downloaded from ${file.github}.`);
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
          console.error(`[Status Page] Error while downloading "${file.name}" from GitHub:`, err);
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

    // Version Contants
    const nodeJsVer = process.versions.node;
    const ocncJsVer = oceanic.Constants.VERSION;
    const statusPageVer = this.modVersion

    // Creating Data For Graphs
    let dataHistory = [];
    function updateStats() {
      let cpuUsagePercent = getProcessCpuPercent();
      let ramUsageMb = getProcessRamMb();
      let timestamp = new Date();
      let guildCount = client.guilds.size;
      let userCount = client.users.size;
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
    function checkBasic(request) {
      if (!password) {
        return true;
      }
      let auth = request.headers.authorization;
      if (!auth || !auth.startsWith("Basic ")) {
        return false;
      }
      let [loginUsername, loginPassword] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");

      if (
        typeof loginUsername === "string" &&
        typeof loginPassword === "string" &&
        loginUsername === username &&
        loginPassword === password
      ) {
        return true;
      } else {
        return false;
      }
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

    // Consolidated Function
    function checkAuthenticated(request, response) {
      switch (loginSystem) {
        case "basic": {
          if (checkBasic(request)) {
            return true;
          } else {
            response.writeHead(401, {
              "www-authenticate": `Basic realm="Status Page"`,
            });
            response.end("Unauthorized");
          }
          break;
        }

        case "token": {
          if (checkToken(request)) {
            return true;
          } else {
            let urlComponents = new URL(request.url, `http://${request.headers.host}`);
            response.writeHead(301, {
              location: `/login?redirect=${encodeURIComponent(urlComponents.pathname)}`,
            });
            response.end();
          }
          break;
        }
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
      return console.error(`[Status Page] Files (${missingSiteFiles.join(", ")}) Are Missing To Serve The Page!`);
    }

    const server = http.createServer((request, response) => {
      let baseUrl = new URL(request.url, `http://${request.headers.host}`);
      let endPoint = baseUrl.pathname;

      switch (endPoint) {
        case "/favicon.ico": {
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
        }

        case "/style.css": {
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
        }

        case "/": {
          response.writeHead(301, { location: "/monitor" });
          response.end();
          break;
        }

        case "/login": {
          let redirectPath = baseUrl.searchParams.get("redirect") || `/monitor`;
          if (!redirectPath.startsWith("/")) {
            redirectPath = `/${redirectPath}`;
          }
          if (redirectPath.startsWith("//")) {
            redirectPath = `/monitor`;
          }

          if (loginSystem === "token" && request.method === "GET") {
            if (checkToken(request)) {
              response.writeHead(301, { location: redirectPath });
              response.end();
            } else {
              response.writeHead(200, {
                "content-type": "text/html",
              });
              fs.createReadStream(loginHtmlFilePath, {
                encoding: "utf-8",
              }).pipe(response);
            }
          } else if (loginSystem === "token" && request.method === "POST") {
            let postBody = "";
            request.on("data", (dataChunk) => (postBody += dataChunk));
            request.on("end", () => {
              postBody = JSON.parse(postBody);
              let loginUsername = postBody.username;
              let loginPassword = postBody.password;
              let successRedirect = postBody.redirect || redirectPath;
              if (
                typeof loginUsername === "string" &&
                typeof loginPassword === "string" &&
                loginUsername === username &&
                loginPassword === password
              ) {
                const newToken = crypto.randomBytes(32).toString("hex");
                activeTokens.push(newToken);
                response.writeHead(200, {
                  "content-type": "application/json",
                  "set-cookie": `spToken=${newToken}; HttpOnly; Path=/; SameSite=Lax`,
                });
                response.end(JSON.stringify({ success: true, redirect: successRedirect }, null, 2));
              } else {
                response.writeHead(401, {
                  "content-type": "application/json",
                });
                response.end(JSON.stringify({ success: false, error: "Invalid Login" }, null, 2));
              }
            });
          } else if (loginSystem === "basic") {
            response.writeHead(301, { location: redirectPath });
            response.end();
          }
          break;
        }

        case "/monitor": {
          if (checkAuthenticated(request, response) == true) {
            response.writeHead(200, {
              "content-type": "text/html",
            });
            fs.createReadStream(htmlFilePath, { encoding: "utf-8" }).pipe(response);
          }
          break;
        }

        case "/raw": {
          if (checkAuthenticated(request, response) == true) {
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
                    statusPage: statusPageVer
                  },
                },
                null,
                2
              )
            );
          }
          break;
        }

        default: {
          response.writeHead(404);
          response.end("Page Not Found!");
          break;
        }
      }
    });

    server.listen(port, host, () => {
      console.log(`[Status Page] Status Page Available At "http://${host}:${port}/monitor"`);
    });
  },
};
