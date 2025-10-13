const { ComponentTypes, ButtonStyles } = require('oceanic.js');

function isTemp(component) {
  return component.type?.type != 'persistent'
}
let validityBoilerplate = {
  title: "Validity",
  UI: [
    {
      element: "text",
      text: "Temporary",
      header: true
    },
    {
      element: "text",
      text: "This button will only work for a certain amount of time. Even if the button's time did not end, a restart will cause it to not work anymore"
    },
    "-",
    {
      element: "text",
      text: "Persistent",
      header: true
    },
    {
      element: "text",
      text: `This button will work forever and will remain usable across restarts, but there are some caveats:
      <b>Variables</b><br>
      Server and Global variables will act as usual. Temporary variables created <u>outside</u> of this button won't be able to be used. To counter this, you can use channel or user data.<br>
      <b>Exceptions</b><br>
      You will be able to use the button's message variable (the one you defined in Options) and obviously, the button's temporary variables (e.g. the Interaction or the User variables)
      <b>Why can't I just maintain my variables?</b><br>
      Storing every temporary variable in a text file or somewhere in the cloud would <b>not</b> be a good idea - temporary variables are created per-command and imagine running a command 1000 times, you'd have to store 1000 at least 1000 variables. That would fill up your hard drive in no time.
      `
    },
  ]
}

module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Select Menu Roles", validity: { type: "temporary", value: "60" }, minSelectable: "1", maxSelectable: "1" },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "lik_rus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "html",
      html: ""
    },
    "-",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "usage",
      types: {
        usage: "Validity"
      },
      UItypes: {
        usage: {
          name: "Validity",
          inheritData: true,
          autoHeight: true,
          UI: [
            { element: "toggle", name: "Disable This", storeAs: "disabled" },
            "-",
            {
              element: "typedDropdown",
              storeAs: "type",
              name: "Validity",
              choices: {
                temporary: { name: "Temporary (Seconds)", field: true },
                persistent: { name: "Persistent" },
                one_time: { name: "One-Time (For Everyone)" },
                one_time_specific: { name: "One-Time (Per User)" },
              },
              help: validityBoilerplate,
            },
          ]
        }
      }
    },
    "_",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "storage",
      types: {
        storage: "Storage"
      },
      UItypes: {
        storage: {
          name: "Interaction, Selection & User Storage",
          inheritData: true,
          autoHeight: true,
          UI: [
            {
              element: "storageInput",
              name: "Store Interaction As",
              storeAs: "storeInteractionAs"
            },

            "_",
            {
              element: "storage",
              storeAs: "storeInteractionAuthorAs",
              name: "Store User As"
            },

            "_",
            {
              element: "storageInput",
              name: "Store Selection List As",
              storeAs: "storeOptionsListAs"
            },
          ]
        }
      }
    },
    "_",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "additionalOptions",
      types: {
        options: "Options"
      },
      UItypes: {
        options: {
          name: "Additional Options",
          inheritData: true,
          pullVariables: true,
          autoHeight: true,
          UI: [
            {
              element: "input",
              name: "Placeholder",
              storeAs: "placeholder"
            },
            {
              element: "input",
              storeAs: "minSelectable",
              name: "Minimum Options Selectable",
            },
            {
              element: "input",
              storeAs: "maxSelectable",
              name: "Maximum Options Selectable",
            },
            {
              element: "var",
              storeAs: "defaultValues",
              name: "List default"
            },
          ]
        }
      }
    },
    "-",
    {
      element: "actions",
      name: "On Submit, Run",
      storeAs: "onSubmit"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  init: (values, bridge) => {
    bridge.createGlobal({
      class: "modularSelects",
      name: values.pushAs || bridge.data.id + "SELECT",
      value: {
        pushValue: values.pushAs,
        actions: values.actions
      }
    })
  },

  run(values, message, client, bridge) {
    const thisID = bridge.data.id + "SELECT";
    const { ComponentTypes } = require('oceanic.js');
    
    const rawDefaultValues = bridge.get((values.defaultValues) || []);
    const defaultValuesArray = Array.isArray(rawDefaultValues)
      ? rawDefaultValues.map(id => ({
          id,
          type: "role",
        }))
      : [];
    
    let result = {
      raw: {
        disabled: values.disabled == true,
        type: ComponentTypes.ACTION_ROW,
        components: [
          {
            type: ComponentTypes.ROLE_SELECT,
            minValues: bridge.transf(values.minSelectable) || 1,
            maxValues: bridge.transf(values.maxSelectable) || 1,
            placeholder: bridge.transf(values.placeholder) || "",
            customID: thisID,
            disabled: values.disabled == true,
            defaultValues: defaultValuesArray,
          }
        ]
      },
      run: (message) => {
        if (!isTemp(values)) return;
        bridge.data.interactionHandlers[`${message.id}`][thisID] = {
          onInteract: values.actions,
          storeInteractionAs: values.storeInteractionAs,
          changeExecutionHierarchy: true,
          run: (interaction) => {
            bridge.createTemporary({ class: "interactionStuff", name: "current", value: interaction });
            bridge.store(values.storeInteractionAs, interaction);
            bridge.store(values.storeInteractionAuthorAs, interaction.user);
            bridge.store(values.storeOptionsListAs, interaction.data.values.raw);
            bridge.runner(values.onSubmit);
          }
        };
      }
    };
    
    bridge.store(values.store, result);
  },
};