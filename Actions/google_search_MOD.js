/*
A mod for Google search

npm i google-sr
*/
module.exports = {
	modules: ["google-sr"],
	data: {
	  name: "Google Search",
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
      element: "input",
      name: "Number of pages to output",
      storeAs: "pages"
    },
    "-",
    {
      element: "toggleGroup",
      storeAs: ["listmode", "safeMode"],
      nameSchemes: ["Merge lists", "Safe mode"]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Save the result"
    }
],
subtitle: (data, constants) => {
    return `${data.text} `
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const text = bridge.transf(values.text);

    const { searchWithPages, OrganicResult } = require('google-sr');

    try {
    const searchResults = await searchWithPages({ 
      query: text, 
      safeMode: values.safeMode,
      resultTypes: [OrganicResult],
      pages: Number(
        bridge.transf(values.pages)
      )
  });

   let Results;
   switch (values.listmode) {
    case true:
      Results = searchResults.reduce((acc, curr) => acc.concat(curr), []);
      break;
    case false:
      Results = searchResults;
      break;
    default:
      Results = searchResults;
      break;
    };

      bridge.store(values.store, Results);
    } catch (error) {bridge.store(values.store, [])};

    }
};
