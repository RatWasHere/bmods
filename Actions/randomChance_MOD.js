modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Random Chance"
  },
  aliases: [],
  modules: [],
  category: "Numbers",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "menu",
      storeAs: "possibilities",
      name: "Possibilities",
      types: {
        possibilities: "possibilities"
      },
      max: 1000,
      UItypes: {
        possibilities: {
          data: {},
          name: "Possibility",
          preview: "`${option.data.chance}%`",
          UI: [
            {
              element: "input",
              storeAs: "chance",
              name: "Chance %",
            },
            {
              element: "actions",
              storeAs: "actions",
              name: "Run Actions",
            },
          ],
        },
      },
    },
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Random Chance Between ${values.possibilities.length} Possibilities.`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const possibilities = values.possibilities.map(p => {
      const parsed = parseFloat(p.data?.chance);
      return {
        ...p,
        data: {
          ...p.data,
          chance: isNaN(parsed) ? 0 : parsed,
          actions: Array.isArray(p.data?.actions) ? p.data.actions : []
        }
      };
    }).filter(p => p.data.chance > 0);
  
    if (possibilities.length === 0) {
      return console.error(`Fill Up Possibilities First!`);
    }
  
    const totalChance = possibilities.reduce((acc, p) => acc + p.data.chance, 0)
    if (totalChance <= 0) return console.error(`All chances are zero.`)
  
    // Normalize chances so they add to 100
    const normalized = possibilities.map(p => ({
      ...p,
      data: {
        ...p.data,
        normalizedChance: (p.data.chance / totalChance) * 100
      }
    }));
  
    const rand = Math.random() * 100
  
    let cumulative = 0;
    for (const p of normalized) {
      cumulative += p.data.normalizedChance
      if (rand < cumulative) {
        if (p.data.actions.length > 0) {
          bridge.runner(p.data.actions, message, client, bridge.variables);
        }
        break;
      }
    }
  }
}