modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Slice List",
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
      storeAs: "initList",
      name: "List",
    },
    {
      element: "input",
      storeAs: "sliceAt",
      name: "Slice List At Position",
      placeholder: "List Starts From #1",
    },
    {
      element: "input",
      storeAs: "sliceTill",
      name: "Slice Till Position",
      placeholder: "To Get Items 1-20 In A List, Slice At 1 Till 20",
    },
    "-",
    {
      element: "store",
      storeAs: "slicedList",
      name: "Store Sliced List As",
    },
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Slice List ${values.initList.type}(${values.initList.value}) At Position ${values.sliceAt}-${values.sliceTill}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    let initList = bridge.get(values.initList)
    let sliceAt = parseInt(bridge.transf(values.sliceAt)) - 1
    if (sliceAt < 0) {
      sliceAt = 0
    }
    let sliceTill = parseInt(bridge.transf(values.sliceTill))
    let result
    if (Array.isArray(initList) && !isNaN(sliceAt) && !isNaN(sliceTill)) {
      result = initList.slice(sliceAt, sliceTill)
    } else if (!Array.isArray(initList) && !isNaN(sliceAt) && !isNaN(sliceTill)) {
      console.error(`Input is not an list!`)
      result = initList
    } else if (Array.isArray(initList) && isNaN(sliceAt) && isNaN(sliceTill)) {
      console.error(`One of the following is not a number: ${bridge.transf(values.sliceAt)}, ${bridge.transf(values.sliceTill)}`)
      result = initList
    } else {
      console.error(`The list input and slice numbers are wrong!`)
      result = initList
    }
    bridge.store(values.slicedList, result)
  },
}
