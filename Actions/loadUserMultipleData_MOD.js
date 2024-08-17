module.exports = {
    data: { name: "Load user multiple data" },
    category: "User Data",
    info: {
        source: "https://github.com/slothyace/BCS/tree/main/Mods",
        creator: "Acedia",
        donate: "ko-fi.com/slothyacedia"
    },
    UI: [
        {
            element: "user",
            storeAs: "user",
            name: "User"
        },
        "-",
        {
            element: "input",
            storeAs: "defaultval",
            name: "Default value"
        },
        "-",
        {
            element: "menu",
            storeAs: "retrievelist",
            name: "List of user data",
            types: {
                data: "datas"
            },
            max: 1000,
            UItypes: {
                data: {
                    data: {},
                    name: "Data name:",
                    preview: "`${option.data.dataname}`",
                    UI: [
                        {
                            element: "input",
                            storeAs: "dataname",
                            name: "User data name"
                        },
                        {
                            element: "store",
                            storeAs: "store"
                        }
                    ]
                }
            }
        }
    ],
    subtitle: (data) => {
        return `Retrieve ${data.retrievelist.length} datas of ${values.user}.`;
    },
    compatibility: ["Any"],

    async run(values, message, client, bridge) {
        let storedData = bridge.data.IO.get();
        let defaultVal = values.defaultval ? bridge.transf(values.defaultval) : '';
        let user = await bridge.getUser(values.user);

        for (let item of values.retrievelist) {
            let userData = defaultVal;

            const dataName = item.data.dataname;
            const storeLocation = item.data.store;

            try {
                const getDataName = bridge.transf(dataName);

                if (storedData.users && storedData.users[user.id] && storedData.users[user.id][getDataName]) {
                    userData = storedData.users[user.id][getDataName];
                }
            } catch (error) {
                storedData.users[user.id] = {};
                bridge.data.IO.write(storedData);
            }

            bridge.store(storeLocation, userData);
        }
    }
}
