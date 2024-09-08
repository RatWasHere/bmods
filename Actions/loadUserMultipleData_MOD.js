module.exports = {
    data: { name: "Get User Multiple Datas" },
    category: "User Data",
    info: {
        source: "https://github.com/slothyace/BCS/tree/main/Mods",
        creator: "Acedia",
        donate: "https://ko-fi.com/slothyacedia"
    },
    UI: [
        {
            element: "input",
            storeAs: "label",
            name: "Label (optional)"
        },
        "-",
        {
            element: "user",
            storeAs: "user",
            name: "User"
        },
        {
            element: "input",
            storeAs: "defaultval",
            name: "Default Value"
        },
        "-",
        {
            element: "menu",
            storeAs: "retrievelist",
            name: "List of User Datas",
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
    subtitle: (values, constants) => {
        return `Retrieve ${values.retrievelist.length} datas of ${constants.user(values.user)}.`;
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
