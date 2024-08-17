module.exports = {
    data: { name: "Load User Multiple Data(s)" },
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
            name: "Default Value"
        },
        "-",
        {
            element: "menu",
            storeAs: "retrievelist",
            name: "List of User Data(s)",
            types: {
                data: "datas"
            },
            max: 1000,
            UItypes: {
                data: {
                    data: {},
                    name: "Data Name:",
                    preview: "`${option.data.dataname}`",
                    UI: [
                        {
                            element: "input",
                            storeAs: "dataname",
                            name: "Data Name"
                        },
                        {
                            element: "store",
                            storeAs: "store",
                            name: "Store As"
                        }
                    ]
                }
            }
        }
    ],
    subtitle: (data) => {
        return `Retrieve ${data.retrievelist.length} data(s) of user.`;
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
