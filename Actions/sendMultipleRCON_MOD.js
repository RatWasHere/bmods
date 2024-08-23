module.exports = {
    data: {
        name: "Send multiple RCON",
    },
    category: "Game",
    info: {
        source: "https://github.com/slothyace/BCS/tree/main/Mods",
        creator: "Acedia",
        donate: "https://ko-fi.com/slothyacedia",
    },
    UI: [
        {
            element: "input",
            storeAs: "label",
            name: "Label (optional)",
        },
        "-",
        {
            element: "menu",
            storeAs: "serverlist",
            name: "RCON List",
            types: {
                servers: "servers",
            },
            max: 20,
            UItypes: {
                servers: {
                    data: {},
                    name: "Command:",
                    preview: "`${option.data.rconcommand}`",
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
            try {
                const rconConfig = {
                    host: `${bridge.transf(server.data.ipaddress)}`,
                    port: `${bridge.transf(server.data.portnumber)}`,
                    pass: `${bridge.transf(server.data.rconpassword)}`,
                };
                const rcon = new Rcon(rconConfig);
    
                await new Promise((resolve, reject) => {
                    const connection = rcon.connect({
                        onSuccess: () => {
                            connection.auth({
                                onSuccess: () => {
                                    connection.send(`${bridge.transf(server.data.rconcommand)}`, {
                                        onSuccess: (response) => {
                                            bridge.store(server.data.store, response);
                                            connection.close();
                                            resolve(response);
                                        },
                                        onError: (error) => {
                                            bridge.store(server.data.store, "Error: Error executing command.");
                                            connection.close();
                                            reject(error);
                                        },
                                    });
                                },
                                onError: (error) => {
                                    bridge.store(server.data.store, "Error: Authentication error (Wrong password).");
                                    connection.close();
                                    reject(error);
                                },
                            });
                        },
                        onError: (error) => {
                            bridge.store(server.data.store, "Error: Connection error (Server is offline or details are incorrect).");
                            reject(error);
                        },
                    });
                });
            }
            
            catch (error) {
                console.error("An error occurred:", error);
            }
        }
    }  
};
