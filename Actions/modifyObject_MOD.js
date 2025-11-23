modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Modify JSON Object"
  },
  aliases: ["Modify Object"],
  modules: [],
  category: "JSON",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "variable",
      storeAs: "original",
      name: "JSON",
    },
    {
      element: "menu",
      storeAs: "modifications",
      name: "Modifications",
      types: {
        modifications: "modifications"
      },
      max: 1000,
      UItypes: {
        modifications: {
          data: {},
          name: "Path",
          preview: "`${option.data.jsonAction.value}`",
          UI: [
            {
              element: "typedDropdown",
              storeAs: "jsonAction",
              name: "Action",
              choices: {
                create: {name: "Create/Replace Element", field: true, placeholder: "path.to.element"},
                delete: {name: "Delete Element", field: true, placeholder: "path.to.element"},
              },
            },
            "-",
            {
              element: "largeInput",
              storeAs: "content",
              name: "Content | Only Applicable If Creating/Replacing An Element"
            },
            "-",
            {
              element: "html",
              html: `
                <button
                  style="width: fit-content"
                  class="hoverablez"
                  onclick="
                          const textArea = document.getElementById('content');
                          const content = textArea.value;
                          const btext = this.querySelector('#buttonText');

                          if (!this.dataset.fixedSize) {
                            this.style.width = this.offsetWidth + 'px';
                            this.style.height = this.offsetHeight + 'px';
                            this.dataset.fixedSize = 'true';
                          }

                          try {
                            let parsed = JSON.parse(content);
                            let formatted = JSON.stringify(parsed, null, 2);
                            this.style.background = '#28a745';
                            btext.textContent = 'Valid';
                            if (content !== formatted){
                              textArea.value = formatted;
                              let textLength = textArea.value.length;
                              textArea.focus();
                              textArea.setSelectionRange(textLength, textLength);
                            }
                          } catch (error) {
                            this.style.background = '#dc3545';
                            btext.textContent = 'Invalid';
                          }
                          setTimeout(() => {
                            this.style.background = '';
                            btext.textContent = 'Validate JSON';
                          }, 500);
                        "
                >
                  <btext id="buttonText"> Validate JSON </btext>
                </button>
              `
            },
            {
              element: "text",
              text: `Wrap your variables with double quotes ("), i.e "\${tempVars('varName')}".`
            },
          ]
        }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "modified",
      name: "Store Modified JSON As"
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Make ${values.modifications.length} Modifications To JSON Object ${values.original.type}(${values.original.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    let original = bridge.get(values.original)

    function isJSON(testObject){
      return (testObject != undefined && typeof testObject === "object" && testObject.constructor === Object)
    }

    function cleanEmpty(obj, keys) {
      for (let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i]
        let parent = keys.slice(0, i).reduce((o, k) => o?.[k], obj)
        if (parent && Object.keys(parent[key] || {}).length === 0) {
          delete parent[key]
        } else {
          break
        }
      }
    }

    const sanitizeArrays = (str) => {
      return str.replace(/\[([^\]]*)\]/g, (match, inner) => {
        const sanitized = inner
          .split(',')
          .map(el => {
            el = el.trim()
            if (el === '') return null
            return '"' + el.replace(/^["']|["']$/g, '').replace(/"/g, '\\"') + '"'
          })
          .filter(el => el !== null)
          .join(', ')
        return `[${sanitized}]`
      })
    }

    if (isJSON(original) !== true){
      bridge.store(values.modified, original)
      console.error(`Value ${original} Is Not A Valid JSON`)
      return
    }

    let originalClone = JSON.parse(JSON.stringify(original))
    for (let modification of values.modifications){
      let modificationData = modification.data

      let actionType = bridge.transf(modificationData.jsonAction.type)
      let objectPath = bridge.transf(modificationData.jsonAction.value).trim()
      let rawContent = bridge.transf(modificationData.content)

      objectPath = objectPath.replaceAll("..", ".")
      if (objectPath.startsWith(".")) {
        objectPath = objectPath.slice(1)
      }

      if (
        objectPath === "" ||
        objectPath.includes("..") ||
        objectPath.startsWith(".") ||
        objectPath.endsWith(".")
      ){return console.error(`Invalid path: "${bridge.transf(values.jsonAction.values)}"`)}

      let keys = objectPath.split(".")
      let lastKey = keys.pop()
      let target = originalClone

      for (const key of keys){
        if (typeof target[key] !== "object" || target[key] === null){
          target[key] = {}
        }
        target = target[key]
      }

      let parsedContent = undefined

      rawContent = sanitizeArrays(rawContent)
      if (!/^\s*(\[|\{)/.test(rawContent)) {
        rawContent = `"${rawContent.replace(/^["']|["']$/g, '').replace(/"/g, '\\"')}"`
      }

      if (actionType !== "delete"){
        try {
          parsedContent = JSON.parse(rawContent)
        } catch (err) {
          return console.error(`Invalid JSON for content: ${err.message}`)
        }
      }

      if (original && isJSON(original)){
        switch (actionType){
          case "create":{
            target[lastKey] = parsedContent
            break
          }

          case "delete":{
            delete target[lastKey]
            cleanEmpty(originalClone, keys)
            break
          }
        }
      }
    }

    bridge.store(values.modified, originalClone)
  }
}