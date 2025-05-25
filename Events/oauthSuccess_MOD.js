module.exports = {
    name: "OAuth Success",
    nameSchemes: ["Store User As"],
    initialize(client, data, run) {

        if (!client.server) {
            client.server = {};
            client.server.events = {};
        }
        
        client.server.events.oauthSuccess = (data) => {
            run([
                data
            ], data)
        };
    }
};