modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Control Multiple Channel Datas",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  category: "Channel Data",
  UI: [
    {
      element: "menu",
      storeAs: "editList",
      name: "List of Channel Datas",
      types: {
        data: "datas",
      },
      max: 1000,
      UItypes:{
        data: {
          data: {},
          name: "Data Name:",
          preview: "`${option.data.dataName}`",
          UI: [
            {
              element: "channelInput",
              storeAs: "channel",
              name: "Channel",
            },
            {
              element: "input",
              storeAs: "dataName",
              name: "Data Name",
            },
            "-",
            {
              element: "typedDropdown",
              storeAs: "control",
              name: "Control",
              choices: {
                add: {name: "Add To Value", field:true, placeholder: "Value To Add"},
                overwrite: {name: "Overwrite", field:true, placeholder: "Value"},
                overwriteList: {name: "Overwrite w/ Var", field:false},
              },
            },
            {
              element: "variable",
              storeAs: "variable",
              name: "Variable (Select \"Overwrite w/ Var\" As The Control)"
            }
          ],
        },
      },
    },
    {
      element: "text",
      text: modVersion,
    }
  ],

  subtitle: (values, constants) => {
    return `Control ${values.editList.length} Channel Datas.`
  },

  compatibility: ["Any"],

  async run (values, message, client, bridge) {
    let storedData = bridge.data.IO.get();
    let dataType = "channels"

    for (let edit of values.editList) {
      try{
        let editData = edit.data
        let editObject = await bridge.getChannel(editData.channel)
        let id = editObject.id

        let currentData = ""
        let dataName = bridge.transf(editData.dataName)
        if(!storedData[dataType][id]){
          storedData[dataType][id] = {}
        }
        if(storedData[dataType][id][dataName]){
          currentData = storedData[dataType][id][dataName]
        }

        let controlType = bridge.transf(editData.control.type)
        switch(controlType){
          case "add":{
            let controlValue = bridge.transf(editData.control.value)
            if(parseFloat(currentData) != NaN && parseFloat(controlValue) != NaN && currentData && editData.control.value){
              currentData = Number(currentData) + Number(controlValue)
            } else {
              currentData = `${currentData}${controlValue}`
            }
            break
          }

          case "overwrite":{
            let controlValue = bridge.transf(editData.control.value)
            currentData = controlValue
            break
          }

          case "overwriteList":{
            let controlValue = bridge.get(editData.variable)
            currentData = controlValue
            break
          }
        }

        storedData[dataType][id][dataName] = currentData 
      } catch (err){
        console.log(err)
        continue
      }
    }
    bridge.data.IO.write(storedData)
  }
}