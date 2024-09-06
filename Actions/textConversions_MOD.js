module.exports = {
  data: {
    name: "Text Conversions",
  },
  info: {
    source: "https://github.com/slothyace/BCS/blob/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia"
  },
  category: "Text",
  UI: [
    {
      element: "largeInput",
      storeAs: "OriginalTxt",
      name: "Text",
    },
    {
      element: "typedDropdown",
      storeAs: "convType",
      name: "Conversion",
      choices: {
        JSONstringify:{name: "JSON to String", field: false},
        JSONparse:{name: "String to JSON", field: false},
        URIencode: {name: "URL Encode (Ignores \"?\", \"=\", \"/\", \"&\", \":\")", field: false},
        URIdecode: {name: "URL Decode (Ignores \"?\", \"=\", \"/\", \"&\", \":\")", field: false},
        URIencodeComp: {name: "URL Component Encode (Encodes Everything)", field: false},
        URIdecodeComp: {name: "URL Component Decode (Decodes Everything)", field: false},
        B64Encode: {name: "Base64 Encode", field: false},
        B64Decode: {name: "Base64 Decode", field: false},
        BinEncode: {name: "Binary Encode", field: false},
        BinDecode: {name: "Binary Decode", field: false},
        utf8Encode: {name: "UTF-8 Encode", field: false},
        utf8Decode: {name: "UTF-8 Decode", field: false}
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Converted Text As"
    }
  ],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find((e) => e.element == "typedDropdown").choices[values.convType.type].name} | Stored as: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let conversionType = bridge.transf(values.convType.type);
    let toConv = bridge.transf(values.OriginalTxt);
    let convertedTxt;

    switch (conversionType) {
      case "JSONstringify":
        convertedTxt = JSON.stringify(toConv);
        break;

      case "JSONparse":
        convertedTxt = JSON.parse(toConv);
        break;

      case "URIencode":
        convertedTxt = encodeURI(toConv);
        break;

      case "URIdecode":
        convertedTxt = decodeURI(toConv);
        break;

      case "URIencodeComp":
        convertedTxt = encodeURIComponent(toConv);
        break;
  
      case "URIdecodeComp":
        convertedTxt = decodeURIComponent(toConv);
        break;

      case "B64Encode":
        convertedTxt = btoa(toConv);
        break;

      case "B64Decode":
        convertedTxt = atob(toConv);
        break;

      case "BinEncode":
        convertedTxt = toConv.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        break;

      case "BinDecode":
        convertedTxt = toConv.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        break;

      case "utf8Encode":
        convertedTxt = new TextEncoder().encode(toConv).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        break;

      case "utf8Decode":
        convertedTxt = new TextDecoder().decode(new Uint8Array(toConv.split('').map(char => char.charCodeAt(0))));
        break;
    }

    bridge.store(values.store, convertedTxt);
  }
}