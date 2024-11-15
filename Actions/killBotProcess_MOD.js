module.exports = {
    data: {
        name: "Kill Bot Process",
    },
    category: "Control",
    info:{
        source: "https://github.com/slothyace/bcx/tree/main/Mods/Actions",
        creator: "Acedia",
        donate: "https://ko-fi.com/slothyacedia"
    },

    UI: [
        {
            element: "text",
            text: "Kills the bot's process, effectively turning the bot off",
        }
    ],

    subtitle: (data) => {
        return `Kills the bot process, nothing below this action will run`;
    },

    compatibility: [`Any`],

    async run(){
        process.exit(0);
    }
}