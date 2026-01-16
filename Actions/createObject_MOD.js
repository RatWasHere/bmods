modVersion = "v1.1.0"
module.exports = {
  data: {
    name: "Create JSON Object",
  },
  aliases: [],
  modules: [],
  category: "JSON",
  info: {
    source: "https://github.com/slothyace/bmods-ace/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "largeInput",
      storeAs: "content",
      name: "JSON Content",
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
      `,
    },
    {
      element: "text",
      text: `Wrap your variables with double quotes ("), i.e "\${tempVars('varName')}".`,
    },
    "-",
    {
      element: "store",
      storeAs: "object",
      name: "Store JSON As",
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (values, constants, thisAction) => {
    // To use thisAction, constants must also be present
    return `Create JSON Object ${values.object.type}(${values.object.value})`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules) {
      await client.getMods().require(moduleName)
    }

    let jsonString = bridge.transf(values.content)
    function sanitizeInput(input) {
      const escapeControlChars = (jsonStr) => {
        return jsonStr.replace(/"(?:\\.|[^"\\])*"/g, (match) => {
          const inner = match.slice(1, -1)
          const escaped = inner.replace(/[\u0000-\u001F\\"]/g, (ch) => {
            switch (ch) {
              case '"':
                return '\\"'
              case "\\":
                return "\\\\"
              case "\b":
                return "\\b"
              case "\f":
                return "\\f"
              case "\n":
                return "\\n"
              case "\r":
                return "\\r"
              case "\t":
                return "\\t"
              default:
                return "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0")
            }
          })
          return `"${escaped}"`
        })
      }

      const sanitizeArrays = (str) => {
        return str.replace(/\[([^\]]*)\]/g, (match, inner) => {
          const sanitized = inner
            .split(",")
            .map((el) => {
              el = el.trim()
              if (el === "") return null
              return '"' + el.replace(/^["']|["']$/g, "").replace(/"/g, '\\"') + '"'
            })
            .filter((el) => el !== null)
            .join(", ")
          return `[${sanitized}]`
        })
      }

      return escapeControlChars(sanitizeArrays(input))
    }

    jsonString = sanitizeInput(jsonString)
    if (!/^\s*(\[|\{)/.test(jsonString)) {
      jsonString = `"${jsonString.replace(/^["']|["']$/g, "").replace(/"/g, '\\"')}"`
    }
    let jsonObject

    try {
      jsonObject = JSON.parse(jsonString)
    } catch (error) {
      return console.error(`[${this.data.name}] Invalid JSON Content: ${error.message}`)
    }

    bridge.store(values.object, jsonObject)
  },
}
