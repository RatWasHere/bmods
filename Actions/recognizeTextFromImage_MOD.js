/*
  Recognize Text From Image Mod by candiedapple
  Licensed under MIT License

  For support ping me on BMD Discord server.
*/

module.exports = {
    data: {
        name: "Recognize Text From Image",
    },
    categroy: "Numbers",
    UI: [
        {
            element: "image",
            storeAs: "image",
            name: "Image",
        },
        "-",
        {
            element: "storageInput",
            storeAs: "store",
            name: "Store recognized text As",
        },
    ],

    async run(values, interaction, client, bridge) {


        const { createWorker } = require('tesseract.js');

       await (async () => {
            const worker = await createWorker();

            const ret = await worker.recognize(await bridge.getImage(values.image));
            bridge.store(values.store, ret.data.text);
            await worker.terminate();
        })();

    },
};

