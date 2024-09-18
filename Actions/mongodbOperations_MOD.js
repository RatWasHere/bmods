/*
  MongoDB Operations mod by candiedapple
  Licensed under MIT License

  Lets you use mongo operations on Bot Maker For Discord.
*/
module.exports = {
  modules: ["mongodb"],
  data: {
    name: "MongoDB Operations",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
    donate: "https://buymeacoffee.com/candiedapple",
  },
  category: "Global Data",
  UI: [
    {
      element: "input",
      name: "MongoDB Connection String",
      placeholder: "Your MongoDB URL",
      storeAs: "mongoConnectionString",
    },
    "-",
    {
      element: "input",
      name: "Database Name",
      storeAs: "databaseName",
    },
    "-",
    {
      element: "input",
      name: "Collection Name",
      storeAs: "collectionName",
    },
    "-",
    {
      element: "halfDropdown",
      name: "Operation",
      storeAs: "operation",
      choices: [
        { name: "Find" },
        { name: "Insert" },
        { name: "Delete" },
        { name: "Update" },
        { name: "Replace" },
      ],
    },
    "-",
    {
      element: "largeInput",
      name: "Query Filter (for Find, Delete, Update, Replace) (JSON)",
      placeholder: "Make sure you use double quotes",
      storeAs: "query",
    },
    "-",
    {
      element: "largeInput",
      name: "Document (for Insert, Update, Replace)",
      placeholder: 'Make sure you use double quotes (")',
      storeAs: "document",
    },
    "-",
    {
      element: "toggle",
      name: "Stringify Result",
      storeAs: "stringifyResult",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
  ],
  subtitle: (data, constants) => {
    return `Operation: ${data.operation} - Collection: ${
      data.collectionName
    } - Store As: ${constants.variable(data.store)}`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const MongoClient = require("mongodb").MongoClient;

    const connectionString = bridge.transf(values.mongoConnectionString);
    const databaseName = bridge.transf(values.databaseName);
    const collectionName = bridge.transf(values.collectionName);

    const mongo = new MongoClient(connectionString);

    try {
      await mongo.connect();

      const database = mongo.db(databaseName);
      const collection = database.collection(collectionName);

      let result;

      switch (values.operation) {
        case "Find":
          var query = JSON.parse(bridge.transf(values.query));
          result = await collection.find(query).toArray();
          break;
        case "Insert":
          var document = JSON.parse(bridge.transf(values.document));
          result = await collection.insertOne(document);
          break;
        case "Delete":
          var query = JSON.parse(bridge.transf(values.query));
          result = await collection.deleteMany(query);
          break;
        case "Update":
          var query = JSON.parse(bridge.transf(values.query));
          var document = JSON.parse(bridge.transf(values.document));
          result = await collection.updateMany(query, { $set: document });
          break;
        case "Replace":
          var query = JSON.parse(bridge.transf(values.query));
          var document = JSON.parse(bridge.transf(values.document));
          result = await collection.replaceOne(query, document);
          break;
        default:
          throw new Error("Invalid operation");
      }

      // Check if stringifyResult toggle is true, then stringify the result
      if (values.stringifyResult) {
        result = JSON.stringify(result);
      }

      bridge.store(values.store, result);
    } finally {
      await mongo.close();
    }
  },
};
