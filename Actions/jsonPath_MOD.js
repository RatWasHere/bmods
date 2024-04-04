module.exports = {
    data: {
        name: "Json Path",
    },
    category: "Json",
    info: {
        source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
        creator: "candiedapple"
    },
    UI: [
        {
            element: "variableInsertion",
            name: "Json (Must be json object)",
            storeAs: "json"
        },
        "-",
        {
            element: "input",
            name: "Json Path",
            storeAs: "path",
            placeholder: "$.store.book[*].author",
        },
        "-",
        {
            element: "storageInput",
            name: "Store Result As",
            storeAs: "store",
        },
    ],
    async run(values, message, client, bridge) {
        const data = bridge.get(values.json);
        const jsonpath = require('jsonpath');
        const result = jsonpath.query(data, bridge.transf(values.path));
        bridge.store(values.store, result);
    }

};