modVersion = "v1.0.0";

module.exports = {
  data: {
    name: "Setup Server Prefixes",
  },
  category: "Server Management",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "text",
      text: "This action is not to use, it sets up server prefixes on bot startup.",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],
  compatibility: ["Any"],

  subtitle: () => {
    return `Setup Server Prefixes (Do not use this action)`;
  },

  startup: async (bridge, client) => {
    // Modify the original messageCreate listener to defer to your custom handler
    client.removeListener("messageCreate", client._events.messageCreate);

    let colors = {
      Reset: "\x1b[0m",
      Bright: "\x1b[1m",
      Dim: "\x1b[2m",
      Underscore: "\x1b[4m",
      Blink: "\x1b[5m",
      Reverse: "\x1b[7m",
      Hidden: "\x1b[8m",

      FgBlack: "\x1b[30m",
      FgRed: "\x1b[31m",
      FgGreen: "\x1b[32m",
      FgYellow: "\x1b[33m",
      FgBlue: "\x1b[34m",
      FgMagenta: "\x1b[35m",
      FgCyan: "\x1b[36m",
      FgWhite: "\x1b[37m",
      FgGray: "\x1b[90m",

      BgBlack: "\x1b[40m",
      BgRed: "\x1b[41m",
      BgGreen: "\x1b[42m",
      BgYellow: "\x1b[43m",
      BgBlue: "\x1b[44m",
      BgMagenta: "\x1b[45m",
      BgCyan: "\x1b[46m",
      BgWhite: "\x1b[47m",
      BgGray: "\x1b[100m",
    };

    const fs = require("fs");
    let data = require("../data.json");
    let textCommands = {};
    let messageCommands = {};
    let bridgeGlobals = {};
    let interactionTokenMap = {};
    let globVars = {};
    let serVars = {};
    let specificInteractionHandlers = {};
    let cachedIO;
    let processPath = "../..";

    data.commands.forEach((command, index) => {
      if (command.type != "event") {
        if (command.trigger == "textCommand") {
          textCommands[command.name.toLowerCase()] = {
            name: command.name,
            trigger: command.trigger,
            boundary: command.boundary,
            rejectionScenario: command.rejectionScenario,
            parameters: command.parameters,
            description: command.description,
            index,
          };
          if (command.aliases) {
            command.aliases.forEach((alias) => {
              if (alias != "") {
                textCommands[alias.toLowerCase()] = {
                  ...textCommands[command.name],
                  name: alias,
                };
              }
            });
          }
        } else if (
          command.trigger == "messageContent" ||
          command.trigger == "anyMessage"
        ) {
          messageCommands[command.name.toLowerCase()] = {
            name: command.trigger == "messageContent" ? command.name : "",
            trigger: command.trigger,
            boundary: command.boundary,
            rejectionScenario: command.rejectionScenario,
            parameters: command.parameters,
            description: command.description,
            index,
          };
          if (command.aliases) {
            command.aliases.forEach((alias) => {
              if (alias != "") {
                messageCommands[alias] = {
                  ...messageCommands[command.name],
                  name: alias,
                };
              }
            });
          }
        }
      }
    });

    let IO /* In / Out */ = {
      write: (newIO) => {
        cachedIO = newIO;
        let dir = data.prjSrc;
        if (!fs.existsSync(dir)) {
          fs.writeFileSync(
            `./AppData/Toolkit/storedData.json`,
            JSON.stringify(newIO)
          );
        } else {
          fs.writeFileSync(
            `${dir}/AppData/Toolkit/storedData.json`,
            JSON.stringify(newIO)
          );
        }
      },
      get: () => {
        if (cachedIO) return cachedIO;
        let dir = data.prjSrc;
        if (fs.existsSync(dir)) {
          let endData = JSON.parse(
            fs.readFileSync(`${dir}/AppData/Toolkit/storedData.json`, "utf8")
          );
          return endData;
        } else {
          let endData = JSON.parse(
            fs.readFileSync(`./AppData/Toolkit/storedData.json`, "utf8")
          );
          cachedIO = endData;
          return endData;
        }
      },
    };

    function runRejectionScenario(
      commandIndex,
      target,
      scenarioType,
      bridge,
      options
    ) {
      let command = data.commands[commandIndex];
      if (command?.rejectionScenario) {
        let scenarioTypeMap = ["notWithin", "missingPermissions"];
        let scenario = command.rejectionScenario[scenarioTypeMap[scenarioType]];
        runActionArray(commandIndex, target, bridge || {}, {
          ...(options || {}),
          actionsOverwrite: scenario,
        });
      }
    }

    function matchesBotOwner(command, authorID) {
      if (command?.boundary?.botOwnerOnly) {
        if (botOwner.id != authorID) {
          runRejectionScenario(command.index, command, 0);
          return false;
        }
      }

      return true;
    }

    const runActionArray =
      /**
       * @async
       * @param {Number | Array} at
       * @param {discord.Interaction | discord.Message} interaction
       * @param {Object | null} actionBridge
       * @param {Object | null} options
       * @returns {unknown}
       */
      async (at, interaction, actionBridge, options) => {
        return new Promise(async (resolve) => {
          let cmdActions;
          let cmdName = "Inbuilt";
          let cmdAt = "Inbuilt";
          let cmdId;
          if (typeof at == "string") {
            cmdActions = data.commands[at].actions;
            cmdName = data.commands[at].name;
            cmdAt = at;
            cmdId = data.commands[at].customId;
          } else {
            cmdActions = at;
          }

          if (options?.actionsOverwrite) {
            cmdActions = options.actionsOverwrite;
          }

          if (options?.data?.at != undefined) {
            cmdAt = options?.data?.at;
          }
          if (options?.data?.name != undefined) {
            cmdName = options?.data?.name;
          }

          let guild;
          if (options?.guild) {
            guild = options.guild;
          } else if (
            interaction?.guildID ||
            Object.keys(interaction).includes("guild")
          ) {
            guild = interaction.guild || interaction.guildID;
          } else {
            guild = client.guilds.first();
          }

          let temporaries = {};

          if (options?.temporaries) {
            temporaries = options.temporaries;
          } else if (actionBridge?.temporaries) {
            temporaries = actionBridge.temporaries;
          }

          let finalVariables = { globalActionCache: {} };
          if (typeof actionBridge == "object") {
            finalVariables = actionBridge;
            if (!finalVariables?.globalActionCache) {
              finalVariables.globalActionCache = {};
            }
          }

          let bridge = {
            temporaries,
            guild,
            stopActionRun: false,
            variables: finalVariables,
            createGlobal: (blob) => {
              if (blob.class) {
                if (!bridgeGlobals[blob.class]) {
                  bridgeGlobals[blob.class] = {};
                }
                bridgeGlobals[blob.class][blob.name] = blob.value;
              } else {
                bridgeGlobals[blob.name] = blob.value;
              }
            },
            file: (fn) => {
              let fileName = bridge.transf(fn.replaceAll("\\\\", "/"));
              const transfPrjSrcPath =
                data.prjSrc.replaceAll("\\\\", "/") + "/" + fileName;
              const transfCurrentPath = `./${fileName}`;
              const transfFileName = fileName;

              if (fs.existsSync(transfCurrentPath)) {
                return transfCurrentPath;
              }
              if (fs.existsSync(transfFileName)) {
                return transfFileName;
              }
              if (fs.existsSync(transfPrjSrcPath)) {
                return transfPrjSrcPath;
              }
              return transfPrjSrcPath;
            },
            getGlobal: (blob) => {
              try {
                if (blob.class) {
                  return bridgeGlobals[blob.class][blob.name];
                } else {
                  return bridgeGlobals[blob.name];
                }
              } catch (e) {}
            },

            createTemporary: (blob) => {
              if (blob.class) {
                if (!bridge.temporaries[blob.class]) {
                  bridge.temporaries[blob.class] = {};
                }
                bridge.temporaries[blob.class][blob.name] = blob.value;
              } else {
                bridge.temporaries[blob.name] = blob.value;
              }
            },
            getTemporary: (blob) => {
              try {
                if (blob.class) {
                  return bridge.temporaries[blob.class][blob.name];
                } else {
                  return bridge.temporaries[blob.name];
                }
              } catch (e) {}
            },

            globals: {},
            data: {
              ranAt: cmdAt,
              nodeName: cmdName,
              actions: cmdActions,
              globals: bridgeGlobals,
              IO,
              interactionTokenMap,
              globalVars: globVars,
              serverVars: serVars,
              commandID: options?.commandID || cmdId,
              interactionHandlers: specificInteractionHandlers,
              invoker: {
                bridge: options?.sourceBridge,
                id: options?.sourceBridge?.data.commandID
                  ? `${options?.sourceBridge?.data.commandID}`
                  : undefined,
              },
            },
            runner: async (source) => {
              await runActionArray(source, interaction, bridge.variables, {
                temporaries: bridge.temporaries,
                guild: bridge.guild,
                commandID: options?.commandID || cmdId,
                sourceBridge: bridge,
              });
            },
            fs: fs,
            callActions: async (blob) => {
              let atAction = 0;
              bridge.stopActionRun = true;

              if (blob.jump) {
                atAction = Number(blob.jump) - Number(1);
              } else if (blob.skip) {
                atAction =
                  Number(blob.skip) + Number(bridge.atAction) + Number(1);
              } else if (blob.stop) {
                bridge.stopActionRun = blob.stop;
                return;
              }

              await runActionArray(
                blob.actions || bridge.data.actions,
                interaction,
                bridge.variables,
                {
                  startAt: atAction,
                  guild: bridge.guild,
                  temporaries: bridge.temporaries,
                  commandID: options?.commandID || cmdId,
                  sourceBridge: bridge,
                }
              );
            },
            call: async (blob, actions) => {
              if (blob.type == "continue") {
                bridge.stopActionRun = false;
                return;
              } else if (blob.type == "stop") {
                bridge.stopActionRun = true;
              } else if (blob.type == "skip") {
                await bridge.callActions({
                  skip: parseFloat(blob.value),
                });
                bridge.stopActionRun = true;
              } else if (blob.type == "jump") {
                await bridge.callActions({
                  jump: parseFloat(blob.value),
                });
                bridge.stopActionRun = true;
              } else if (blob.type == "runActions") {
                await bridge.runner(actions);
              } else if (blob.type == "anchorJump") {
                bridge.stopActionRun = true;
                await bridge.runner(
                  bridge.getGlobal({
                    class: "anchors",
                    name: bridge.transf(blob.value),
                  })
                );
              } else if (blob.type == "callAnchor") {
                await bridge.runner(
                  bridge.getGlobal({
                    class: "anchors",
                    name: bridge.transf(blob.value),
                  })
                );
              }

              return;
            },
            getGuild: async (blob) => {
              if (!blob || blob.type == "current") {
                return bridge.guild;
              } else if (blob.type == "id") {
                return (
                  client.guilds.get(bridge.transf(blob.value)) ||
                  (await client.rest.guilds.get(bridge.transf(blob.value)))
                );
              } else {
                return await bridge.get({ value: blob.value, type: blob.type });
              }
            },
            getAutoModRule: async (blob) => {
              if (blob.type == "id") {
                return (
                  bridge.guild.autoModerationRules.get(
                    bridge.transf(blob.value)
                  ) ||
                  (await bridge.guild.getAutoModerationRule(
                    bridge.transf(blob.value)
                  ))
                );
              }
              return await bridge.get({ value: blob.value, type: blob.type });
            },
            toMember: async (user, guild) => {
              if (user.guild) return user;
              return await bridge.guild.getMember(user.id);
            },
            toUser: async (member) => {
              if (member.createDM) return member;
              return (
                client.users.get(member.id) ||
                (await client.rest.users.get(member.id))
              );
            },
            getUser: async (blob, careless) => {
              let user = {};
              let member = {};

              if (blob.type == "id") {
                user = client.users.get(bridge.transf(blob.value));
                if (!user?.createDM) {
                  user = await client.rest.users.get(bridge.transf(blob.value));
                }
              } else if (blob.type == "mentioned") {
                user = (interaction.message || interaction).mentions.users[0];
              } else if (blob.type == "author") {
                user = interaction.author;
              } else if (blob.type == "messageAuthor") {
                user = interaction.message.author;
              } else if (blob.type == "user") {
                user = interaction.data.author;
              } else {
                user = await bridge.get({ value: blob.value, type: blob.type });
                if (careless && user) return user;
                if (Array.isArray(user)) return user;
                if (!user.user) {
                  if (!user?.createDM) {
                    user = await client.rest.users.get(user.id);
                  }
                } else {
                  member = user;
                  user = user.user;
                }
              }

              if (!user.member || Object.keys(member).length == 0) {
                try {
                  member = bridge.guild.members.get(user.id);
                  if (!member?.edit) {
                    member = await bridge.guild
                      .getMember(user.id)
                      .catch((err) => {});
                  }
                } catch (err) {}
              }

              user.member = member || user;

              if (!user?.id) {
                console.log(
                  `${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid User. Next error(s) will probably be about it!${colors.Reset}`
                );
              }

              return user;
            },
            getRole: async (blob) => {
              let role = {};

              if (blob.type == "id" || blob.type == "roleID") {
                role = await bridge.guild.roles.get(bridge.transf(blob.value));
              } else if (blob.type == "mentioned") {
                role = (interaction.message || interaction).mentions.roles[0];
                role = await bridge.guild.roles.get(role);
              } else {
                role = await bridge.get({ value: blob.value, type: blob.type });
              }

              if (!role) {
                console.log(
                  `${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid Role. Next error(s) will probably be about it!${colors.Reset}`
                );
              }

              return role;
            },

            getImage: async (blob) => {
              if (blob.type == "none") return;
              if (blob.type == "url") {
                let fetchedResult = await fetch(bridge.transf(blob.value));
                if (!fetchedResult.ok) {
                  throw new Error(
                    `Fetch failed with status: ${fetchedResult.status}`
                  );
                }
                let buffer = await fetchedResult.arrayBuffer();
                let result = buffer;
                return Buffer.from(buffer);
              } else if (blob.type == "file") {
                let image = fs.readFileSync(bridge.file(blob.value));
                return image;
              } else {
                let image = await bridge.get({
                  value: blob.value,
                  type: blob.type,
                });
                return image;
              }
            },

            getMessage: async (blob) => {
              let message = {};

              if (blob.type == "none") return;

              if (blob.type == "commandMessage") {
                message = interaction.message || interaction;
              } else if (blob.type == "interactionReply") {
                if (interaction.deffered) {
                  message = await interaction.getFollowup();
                } else {
                  message = await interaction.getOriginal();
                }
              } else {
                message = bridge.get({ value: blob.value, type: blob.type });
              }

              return message;
            },

            getInteraction: async (blob) => {
              let interactionResult = {};

              if (blob.type == "commandInteraction") {
                interactionResult = interaction;
              } else {
                interactionResult = bridge.get({
                  value: blob.value,
                  type: blob.type,
                });
              }

              return interactionResult;
            },

            getChannel: async (blob) => {
              let channel;

              if (blob.type == "id") {
                channel = client.getChannel(bridge.transf(blob.value));
                if (!channel.createMessage) {
                  channel = await client.rest.channels.get(
                    bridge.transf(blob.value)
                  );
                }
              } else if (blob.type == "userID") {
                channel =
                  client.users.get(bridge.transf(blob.value)) ||
                  (await client.rest.users.get(bridge.transf(blob.value)));
              } else if (blob.type == "user") {
                channel = interaction.data.author;
              } else if (blob.type == "mentionedChannel") {
                channel = client.getChannel(interaction.mentions.channels[0]);
                if (!channel.createMessage) {
                  channel = await client.rest.channels.get(
                    interaction.mentions.channels[0]
                  );
                }
              } else if (blob.type == "mentionedUser") {
                channel = interaction.mentions.users[0];
                if (!channel.createDM) {
                  channel = await client.rest.users.get(
                    interaction.mentions.users[0]
                  );
                }
              } else if (blob.type == "commandAuthor") {
                channel = interaction.author;
              } else if (blob.type == "command") {
                if (
                  interaction.inDirectMessageChannel &&
                  interaction.inDirectMessageChannel()
                ) {
                  channel = await interaction.author.createDM();
                } else {
                  channel = interaction.channel;
                }
              } else {
                channel = await bridge.get({
                  value: blob.value,
                  type: blob.type,
                });
              }

              try {
                if (channel.createDM) {
                  channel = await channel.createDM();
                }
              } catch (err) {}

              if (!channel) {
                console.log(
                  `${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid Channel. Next error(s) will probably be about it!${colors.Reset}`
                );
              }

              return channel;
            },

            get: (blob) => {
              let result;

              if (blob.type == "tempVar" || blob.type == "temporary") {
                result = bridge.variables[blob.value];
              } else if (blob.type == "serverVar" || blob.type == "server") {
                try {
                  result = serVars[bridge.guild.id][blob.value];
                } catch (error) {}
              } else if (blob.type == "globVar" || blob.type == "global") {
                result = globVars[blob.value];
              }

              return result;
            },

            store: (blob, value) => {
              try {
                if (!blob) return;
                if (blob.type == "temporary" || blob.type == "tempVar") {
                  bridge.variables[blob.value] = value;
                  return;
                }
                if (blob.type == "server" || blob.type == "serverVar") {
                  if (!serVars[bridge.guild.id]) {
                    serVars[bridge.guild.id] = {};
                  }
                  serVars[bridge.guild.id][blob.value] = value;
                  return;
                }
                if (blob.type == "global" || blob.type == "globVar") {
                  if (!globVars) {
                    globVars = {};
                  }
                  globVars[blob.value] = value;
                  return;
                }
              } catch (err) {
                console.log(err);
              }
            },

            generateCustomID: () => {
              customIDs++;
              return `${cmdName}${bridge.atAction}` + customIDs;
            },

            transf: (txt) => {
              let command = {};
              // interaction might not be available in all contexts where transf is called (e.g., startup hooks)
              // So, add a check for interaction existence before accessing its properties.
              if (typeof interaction !== "undefined" && interaction?.author) {
                command.author = interaction.author;
                command.author.name =
                  interaction.author.globalName || interaction.author.username;
                command.channel = interaction.channel;
                command.message = interaction;
              }

              let text = `${txt}`;
              try {
                let toDiscord = (variable) => {
                  if (
                    typeof variable == "string" ||
                    variable == undefined ||
                    typeof variable == "number"
                  ) {
                    return variable;
                  } else {
                    if (variable.roles && variable.guild) {
                      return `<@${variable.id}>`;
                    } else if (
                      variable.sendTyping != undefined ||
                      variable.messages
                    ) {
                      return `<#${variable.id}>`;
                    } else if (variable.avatarURL) {
                      return `<@${variable.id}>`;
                    } else if (typeof variable.hoist == "boolean") {
                      return variable.mention;
                    } else {
                      return variable;
                    }
                  }
                };

                const tempVars = (variable) => {
                  // Ensure bridge.variables exists before accessing
                  if (
                    bridge.variables &&
                    bridge.variables[variable] !== undefined
                  ) {
                    return toDiscord(bridge.variables[variable]);
                  }
                  return `\${tempVars[${variable}]}`; // Return original if not found, for re-evaluation
                };
                const serverVars = (variable) => {
                  // Ensure serVars and guild ID exists before accessing
                  if (
                    bridge.guild &&
                    serVars[bridge.guild.id] &&
                    serVars[bridge.guild.id][variable] !== undefined
                  ) {
                    return toDiscord(serVars[bridge.guild.id][variable]);
                  }
                  return `\${serverVars[${variable}]}`; // Return original if not found
                };
                const globalVars = (variable) => {
                  // Ensure globVars exists before accessing
                  if (globVars && globVars[variable] !== undefined) {
                    return toDiscord(globVars[variable]);
                  }
                  return `\${globalVars[${variable}]}`; // Return original if not found
                };

                let formattedText = text;
                // Escape all literal backslashes first, so they don't get misinterpreted as escape sequences by eval.
                formattedText = formattedText.replace(/\\/g, "\\\\");
                // Then escape backticks, so they don't prematurely close the template literal.
                formattedText = formattedText.replace(/`/g, "\\`");

                const evaluatedText = eval("`" + formattedText + "`");
                return evaluatedText;
              } catch (err) {
                console.error(`Error in transf function`, err);
                return text; // Return original text on error, don't break the bot
              }
            },
          };

          if (!bridge.data.invoker.bridge) {
            bridge.data.invoker.bridge = bridge;
          }

          for (let action in cmdActions) {
            if (!!cmdActions[action]) {
              /* See If The Thing Is Meant To Keep Going! */
              if (bridge.stopActionRun == false) {
                let skipUntil = 0;
                if (
                  typeof options?.startAt != "boolean" &&
                  options?.startAt != "NaN" &&
                  typeof options?.startAt == "number"
                ) {
                  skipUntil = options.startAt;
                } else {
                  skipUntil = 0;
                }
                if (action >= skipUntil && !cmdActions[action].disabled) {
                  bridge.atAction = action;
                  bridge.data.id = bridge.data.actions[bridge.atAction].id;
                  try {
                    /* Run The Action, Make It Happen! */
                    if (!cmdActions[action].file) {
                      cmdActions[action].run(
                        cmdActions[action].data,
                        interaction,
                        client,
                        bridge
                      );
                    } else {
                      await require(`${processPath}/AppData/Actions/${cmdActions[action].file}`).run(
                        cmdActions[action].data,
                        interaction,
                        client,
                        bridge
                      );
                    }
                  } catch (err) {
                    /* Alert The User Of The Error */
                    console.log(
                      `${colors.BgRed}${colors.FgBlack}${cmdName} ${
                        colors.FgBlack + colors.BgWhite
                      }(@#${cmdAt})${
                        colors.Reset + colors.BgRed + colors.FgBlack
                      } >>> ${cmdActions[action].name} ${
                        colors.FgBlack + colors.BgWhite
                      }(@#${action})${
                        colors.Reset + colors.BgRed + colors.FgBlack
                      } >>> Error: ${err}${colors.Reset}`
                    );
                    console.log(err);
                  }
                }
              } else {
                resolve();
                return;
              }
            }
          }
          resolve();
        });
      };

    // Add my own messageCreate event
    client.on("messageCreate", async (msg) => {
      // Ignore bot's own messages, because we ain't listening to ourselves.
      if (msg.author.id == client.user.id) return;

      let effectivePrefix = data.prefix; // Start with the global default prefix
      let commandHandled = false; // Flag to stop further processing if a command is found

      // If the message is from a guild, try to get its custom prefix from storedData.json
      if (msg.guildID) {
        try {
          const storedData = IO.get();
          const guildPrefix = storedData.guildPrefixes?.[msg.guildID];

          if (
            guildPrefix &&
            typeof guildPrefix === "string" &&
            guildPrefix.length > 0
          ) {
            effectivePrefix = guildPrefix;
          }
        } catch (e) {
          console.error(
            "Error fetching custom prefix from storedData.json:",
            e
          );
          // Fallback to default if there's an error fetching
        }
      }

      // Only proceed with effectivePrefix if a command hasn't been handled by mention
      if (!commandHandled && `${msg.content}`.startsWith(effectivePrefix)) {
        let contentWithoutPrefix = msg.content
          .substring(effectivePrefix.length)
          .trim();
        let commandName = contentWithoutPrefix.split(" ")[0].toLowerCase();

        let command = textCommands[commandName];

        if (command) {
          if (
            `${effectivePrefix.toLowerCase()}${command.name.toLowerCase()}`.toLowerCase() ===
            msg.content.split(" ")[0].toLowerCase()
          ) {
            let matchesPermissions = true;
            if (command.boundary) {
              if (!matchesBotOwner(command, msg.author.id)) {
                commandHandled = true;
                return;
              }
              if (command.boundary.worksIn == "guild") {
                if (!msg.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, msg, 0);
                }
              }
              if (command.boundary.worksIn == "dms") {
                if (msg.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, msg, 0);
                }
              }

              if (msg.member && msg.member.permissions) {
                for (let permission in command.boundary.limits) {
                  if (
                    msg.member.permissions.has(
                      command.boundary.limits[permission]
                    ) == false &&
                    matchesPermissions != false
                  ) {
                    matchesPermissions = false;
                  }
                }
              }
            }

            if (matchesPermissions == true) {
              runActionArray(`${command.index}`, msg);
              commandHandled = true;
            } else {
              runRejectionScenario(`${command.index}`, msg, 1);
              commandHandled = true;
            }
          }
        }
      }

      // --- Process Message Content Commands (These typically don't use prefixes) ---
      // This loop runs independently of prefix checks.
      // It should run regardless of whether a prefix command was handled,
      // unless you explicitly want to stop it.
      for (let cmd in messageCommands) {
        let command = messageCommands[cmd];

        let messageContent = `${msg.content}`;
        if (messageContent.toLowerCase().includes(command.name.toLowerCase())) {
          let matchesPermissions = true;
          if (command.boundary) {
            if (!matchesBotOwner(command, msg.author.id)) return;
            if (command.boundary.worksIn == "guild") {
              if (!msg.guild) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, msg, 0);
              }
            }
            if (command.boundary.worksIn == "dms") {
              if (msg.guild) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, msg, 0);
              }
            }

            if (msg.member && msg.member.permissions) {
              for (let permission in command.boundary.limits) {
                if (
                  msg.member.permissions.has(
                    command.boundary.limits[permission]
                  ) == false &&
                  matchesPermissions != false
                ) {
                  matchesPermissions = false;
                }
              }
            }
          }

          if (matchesPermissions == true) {
            runActionArray(`${command.index}`, msg);
          } else {
            runRejectionScenario(`${command.index}`, msg, 1);
          }
        }
      }
    });

    console.log("Setup Server Prefixes MOD loaded successfully!");
  },
};
