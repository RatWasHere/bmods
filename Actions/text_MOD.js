/*
A mod for creating a variable in the form of text, or you can convert the text to a list and save it to a variable
*/
module.exports = {
	data: {
	  name: "Text",
	},
	info: {
	  source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
	  creator: "lik_rus",
	},
	category: "Text",

	UI: [
    {
      element: "largeInput",
      name: "Text",
      storeAs: "text"
    },
    {
      element: "halfDropdown",
      storeAs: "tipo",
      extraField: "separador",
      name: "Type",
      choices: [
        {
          name: "Text"
        },
        {
          name: "Convert text to a list",
          field: true,
          placeholder: "Separator"
        }
      ]
    },
	  "-",
	  {
		element: "store",
		name: "Store As",
		storeAs: "storage"
	  }
],
subtitle: (data, constants) => {
    return `${data.text} `
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {

    var text = bridge.transf(values.text);
    const tipo = bridge.transf(values.tipo);
    const separador = bridge.transf(values.separador);

    if(tipo == "Convert text to a list"){
      text = text.split(new RegExp(separador))
      }

    bridge.store(values.storage, text)


  },
};