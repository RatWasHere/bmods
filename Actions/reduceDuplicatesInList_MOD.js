modVersion = "s.v1.0"
module.exports = {
  data: {
    name: "Reduce Duplicates In List",
    symbol: "×",
  },
  aliases: [],
  modules: [],
  category: "Lists",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "inputList",
      name: "List",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "affixPos",
      name: "Affix Position",
      choices: {
        prefix: {name: "Before Element | Example: ×5 Element", field: false},
        suffix: {name: "After Element | Example: Element ×5", field: false},
      },
    },
    {
      element: "input",
      storeAs: "symbol",
      name: "Multiplier Symbol"
    },
    {
      element: "typedDropdown",
      storeAs: "multiplierPos",
      name: "Multiplier Position",
      choices: {
        before: {name: "Before Symbol | Example: 5×", field: false},
        after: {name: "After Symbol | Example: ×5", field: false},
      },
    },
    "-",
    {
      element: "store",
      storeAs: "reducedList",
      name: "Store Reduced List As"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Reduce duplicates in ${values.inputList.type}(${values.inputList.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    let inputList = bridge.get(values.inputList)
    
    elementMap = {}
    for (element of inputList){
      elementMap[element] = (elementMap[element]||0) + 1
    }

    let affixPosition = bridge.transf(values.affixPos.type)
    let multiplierPosition = bridge.transf(values.multiplierPos.type)
    let mergedPositioner = `${multiplierPosition}${affixPosition}`
    let symbol = bridge.transf(values.symbol) || ""
    let reduced = []
    for (let [item, count] of Object.entries(elementMap)){
      if (count > 1){
        switch(mergedPositioner){
          case "beforeprefix":
            reduced.push(`${count}${symbol} ${item}`)
            break

          case "afterprefix":
            reduced.push(`${symbol}${count} ${item}`)
            break

          case "beforesuffix":
            reduced.push(`${item} ${count}${symbol}`)
            break

          case "aftersuffix":
            reduced.push(`${item} ${symbol}${count}`)
            break
        }
      }
      else {
        reduced.push(item)
      }
    }

    bridge.store(values.reducedList, reduced)
  }
}