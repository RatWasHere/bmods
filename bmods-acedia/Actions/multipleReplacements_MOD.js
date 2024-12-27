module.exports = {
  data: {
    name: "Multiple Replacements"
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/QOLs",
    creator: "Acedia QOLs",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Text",
  modules: [],
  UI:[
    {
      element: "largeInput",
      storeAs: "originalText",
      name: "Text",
    },
    {
      element: "menu",
      storeAs: "replaceList",
      name: "Replacements",
      types: {
        replacements: "replacements",
      },
      max: 100,
      UItypes: {
        replacements:{
          data: {},
          name: "Replace",
          preview: "`${option.data.findText} with ${option.data.replaceText}`",
          UI: [
            {
              element: "input",
              storeAs: "findText",
              name: "Find Text",
            },
            {
              element: "input",
              storeAs: "replaceText",
              name: "Replacement Text",
            },
          ],
        },
      },
    },
    {
      element: "store",
      storeAs: "output",
      name: "Store Output As"
    }
  ],

  subtitle: (values) => {
    return `Replace ${values.replaceList.length} matches.`
  },

  async run(values, interaction, client, bridge){
    let oriTxt = bridge.transf(values.originalText)

    for (let replace of values.replaceList){
      const finder = bridge.transf(replace.data.findText)
      const replacer = bridge.transf(replace.data.replaceText)

      oriTxt = oriTxt.replaceAll(finder, replacer)
    }

    bridge.store(values.output, oriTxt)
  }
}