module.exports = {
    data: {
        name: "Send multiple RCON",
    },
    category: "Game",
    info: {
        source: "https://github.com/slothyace/BCS/tree/main/Mods",
        creator: "Acedia",
        donate: "ko-fi.com/slothyacedia",
    },
    UI: [
        {
            element: "input",
            storeAs: "label",
            name: "Label",
        },
        "-",
        {
            element: "menu",
            storeAs: "serverlist",
            name: "Server List",
            types: {
                servers: "servers",
            },
            max: 20,
            UItypes: {
                servers: {
                    data: {},
                    name: "Server Details:",
                    preview: "`${option.data.ipaddress}:${option.data.portnumber}, command: ${option.data.rconcommand}`",
                    UI: [
                        {
                            element: "input",
                            storeAs: "ipaddress",
                            name: "Server IP Address",
                        },
                        {
                            element: "input",
                            storeAs: "portnumber",
                            name: "RCON Port",
                        },
                        {
                            element: "input",
                            storeAs: "rconpassword",
                            name: "RCON Password",
                        },
                        "-",
                        {
                            element: "largeInput",
                            storeAs: "rconcommand",
                            name: "RCON Command",
                        },
                        "-",
                        {
                            element: "storage", 
                            storeAs: "store",
                            name: "Store Reply As",
                        },
                    ]
                }
            }
        }
    ],

    subtitle: (data) => {
        return `Label: ${data.label} | Send ${data.serverlist.length} RCON commands.`;
    },

    compatibility: ["Any"],

    async run(values, interaction, client, bridge) {
        const Rcon = require("mbr-rcon");

        for (let server of values.serverlist) {
            const rconConfig = {
                host: `${bridge.transf(server.data.ipaddress)}`,
                port: `${bridge.transf(server.data.portnumber)}`,
                pass: `${bridge.transf(server.data.rconpassword)}`,
            };
            const rcon = new Rcon(rconConfig);

            await new Promise((resolve, reject) => {
                const connection = rcon.connect({
                    onSuccess: () => {
                        console.log("Connected to RCON server");
                        connection.auth({
                            onSuccess: () => {
                                console.log("Authenticated successfully");
                                connection.send(`${bridge.transf(server.data.rconcommand)}`, {
                                    onSuccess: (response) => {
                                        console.log("Server response:", response);
                                        bridge.store(server.data.store, response);
                                        connection.close();
                                        resolve(response);
                                    },
                                    onError: (error) => {
                                        console.error("Error executing command:", error);
                                        connection.close();
                                        reject(error);
                                    },
                                });
                            },
                            onError: (error) => {
                                console.error("Authentication error:", error);
                                connection.close();
                                reject(error);
                            },
                        });
                    },
                    onError: (error) => {
                        console.error("Connection error:", error);
                        reject(error);
                    },
                });
            });
        }
    },
};
