/* 
  If any bug happens or you want a feature added feel free to reach me through Discord: Maco (search in bmd server)
*/

module.exports = {
  data: {
    name: "Check If Image Is Valid",
  },
  category: "Images",
  info: {
    source: "https://github.com/JoaoTownsend/bmods/Actions/checkIfAttachmentImageIsValid_MOD.js",
    creator: "Maco",
    description: "This mod verifies the integrity of attachment image files, checking their signature headers and comparing them to the standard. If signature headers are okay returns true, else returns false. Feel free to edit :)",
  },

  UI: [
    {
      element: "text",
      text: "Uses signature headers to confirm png, jpg and jpeg images are valid.",
    },
    {
      element: "input",
      name: "AttachmentUrl",
      placeholder: "GetAttachmentInfo -> URL -> temp var here",
      storeAs: "attachmentUrl",
      variable: "attachmentUrl",
    },
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True",
    },
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False",
    },
  ],

  async run(values, message, client, bridge) {

    try {
        const url = bridge.transf(values.attachmentUrl);

        const res = await fetch(url);
        const arrBuffer = await res.arrayBuffer();
        const buffer = new Uint8Array(arrBuffer);

        if (isValidImage(buffer)) {
            await bridge.call(values.true, values.trueActions);
        } else {
            await bridge.call(values.false, values.falseActions);
        }

    } catch (err) {
        console.error("Image validation error:", err);
    }
    
    function isValidImage(buffer) {

        // --- PNG: 89 50 4E 47 0D 0A 1A 0A ---
        const pngSig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        const isPNG = pngSig.every((b, i) => buffer[i] === b);

        // --- JPEG/JPG: FF D8 FF E0 (JFIF) or FF D8 FF E1 (Exif) ---
        const jpegSig = [0xFF, 0xD8, 0xFF];
        const isJPEG = jpegSig.every((b, i) => buffer[i] === b) &&
            (buffer[3] === 0xE0 || buffer[3] === 0xE1);
     
        return isPNG || isJPEG;
    }
  },
};
