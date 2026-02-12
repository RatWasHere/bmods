module.exports = {
  category: "Lists",
  data: {
    name: "Create Pages From List",
  },
  info: {
    creator: "fusionist__",
  },
  UI: [
    {
      element: "var",
      storeAs: "list",
      name: "List",
    },
    "-",
    {
      element: "input",
      storeAs: "resultsPerPage",
      name: "Elements Per Page",
      placeholder: "Default: 10",
    },
    "_",
    {
      element: "input",
      storeAs: "itemFormat",
      name: "Per-Element Format",
      placeholder: "{value}",
      help: {
        title: "Per-Element Format",
        UI: [
          {
            element: "text",
            text: "What This Does",
            header: true,
          },
          {
            element: "text",
            text: "This template is applied to each element before pages are joined together.",
          },
          "-",
          {
            element: "text",
            text: "Placeholders",
            header: true,
          },
          {
            element: "text",
            text: "{value} = current list element value.",
          },
          {
            element: "text",
            text: "{index} = element number across the full list.",
          },
          {
            element: "text",
            text: "{localIndex} = element number within the current page.",
          },
          "-",
          {
            element: "text",
            text: "Examples",
            header: true,
          },
          {
            element: "text",
            text: "{value}",
          },
          {
            element: "text",
            text: "- {value}",
          },
          {
            element: "text",
            text: "[{index}] {value}",
          },
        ],
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "numberStyle",
      name: "Number Style",
      help: {
        title: "Number Style",
        UI: [
          {
            element: "text",
            text: "Built-In Styles",
            header: true,
          },
          {
            element: "text",
            text: "Disabled turns numbering off. 1. Value and 1) Value prepend an index automatically.",
          },
          "-",
          {
            element: "text",
            text: "Custom Style",
            header: true,
          },
          {
            element: "text",
            text: "Custom uses your template as the prefix before each formatted element.",
          },
          {
            element: "text",
            text: "Supported placeholders:",
            header: true,
          },
          {
            element: "text",
            text: "{index} = element number across the full list (keeps counting between pages).",
          },
          {
            element: "text",
            text: "{localIndex} = element number within the current page (resets to 1 on each page).",
          },
          {
            element: "text",
            text: "{value} = current list element value.",
          },
          "-",
          {
            element: "text",
            text: "Examples",
            header: true,
          },
          {
            element: "text",
            text: "{index}. {value}",
          },
          {
            element: "text",
            text: "{index}) {value}",
          },
          {
            element: "text",
            text: "#{localIndex}: {value}",
          },
        ],
      },
      choices: {
        off: { name: "Disabled" },
        dot: { name: "1. Value" },
        paren: { name: "1) Value" },
        custom: { name: "Custom", field: true },
      },
    },
    "_",
    {
      element: "typedDropdown",
      storeAs: "joinStyle",
      name: "Element Separator",
      choices: {
        disabled: { name: "Disabled" },
        newLine: { name: "New Line" },
        custom: { name: "Custom", field: true, placeholder: ", " },
      },
      help: {
        title: "Element Separator",
        UI: [
          {
            element: "text",
            text: "Separator Modes",
            header: true,
          },
          {
            element: "text",
            text: "Disabled: no separator is added between elements.",
          },
          {
            element: "text",
            text: "New Line: elements are joined with line breaks.",
          },
          {
            element: "text",
            text: "Custom: use your own separator text (for example: ,  or  | ).",
          },
        ],
      },
    },
    "-",
    {
      element: "store",
      storeAs: "storePagesListAs",
      name: "Store Pages List As",
    },
    "_",
    {
      element: "store",
      storeAs: "storePageCountAs",
      name: "Store Total Pages As",
      optional: true,
    },
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `List: ${constants.variable(values.list)} - Store Pages List As: ${constants.variable(values.storePagesListAs)}`;
  },

  async run(values, message, client, bridge) {
    const list = bridge.get(values.list);
    if (!Array.isArray(list) || !values.storePagesListAs?.value) return;

    const perPageRaw = parseInt(bridge.transf(values.resultsPerPage), 10);
    const perPage = Number.isFinite(perPageRaw) && perPageRaw > 0 ? perPageRaw : 10;
    const numberStyle = values.numberStyle?.type || "off";
    const joinStyle = values.joinStyle?.type || "disabled";

    const formatTemplate = values.itemFormat ? bridge.transf(values.itemFormat) : "{value}";
    let separatorRaw = "";
    if (joinStyle === "newLine") {
      separatorRaw = "\\n";
    } else if (joinStyle === "custom") {
      separatorRaw = values.joinStyle?.value !== undefined ? bridge.transf(values.joinStyle.value) : ", ";
    }
    const separator = String(separatorRaw).replaceAll("\\n", "\n").replaceAll("\\t", "\t");

    const totalPages = Math.ceil(list.length / perPage);
    const pagesList = [];

    for (let start = 0, page = 1; start < list.length; start += perPage, page++) {
      const chunk = list.slice(start, start + perPage);
      const formattedItems = chunk.map((item, i) => {
        const index = start + i + 1;
        const localIndex = i + 1;
        let formatted = formatTemplate
          .replaceAll("{value}", `${item}`)
          .replaceAll("{index}", `${index}`)
          .replaceAll("{localIndex}", `${localIndex}`);
        if (numberStyle !== "off") {
          let prefix;
          if (numberStyle === "custom") {
            const customTemplate = values.numberStyle?.value
              ? bridge.transf(values.numberStyle.value)
              : "{index}. ";
            prefix = customTemplate
              .replaceAll("{value}", `${item}`)
              .replaceAll("{index}", `${index}`)
              .replaceAll("{localIndex}", `${localIndex}`);
          } else {
            prefix = numberStyle === "paren" ? `${index}) ` : `${index}. `;
          }
          formatted = `${prefix}${formatted}`;
        }
        return formatted;
      });

      const pageValue = formattedItems.join(separator);
      pagesList.push(pageValue);
    }

    bridge.store(values.storePagesListAs, pagesList);

    if (values.storePageCountAs && values.storePageCountAs.type != "none") {
      bridge.store(values.storePageCountAs, totalPages);
    }
  },
};
