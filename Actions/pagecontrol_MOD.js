modVersion = "v1.0.0";

module.exports = {
  data: { name: "Page Control", pag: "10" },
  category: "Control",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "LikRus",
    donate: "https://boosty.to/cactus/donate",
  },
  UI: [
    {
      element: "inputGroup",
      storeAs: ["total", "pag"],
      nameSchemes: ["Total elements", "Elements on the page"],
    },
    "-",
    {
      element: "store",
      name: "Store Total number of pages",
      storeAs: "storage",
    },
    "_",
    {
      element: "store",
      name: "Store number of the initial element",
      storeAs: "storage3",
    },
    "-",
    {
      element: "var",
      storeAs: "var",
      name: "Current Page",
    },
    "_",
    {
      element: "store",
      storeAs: "storage2",
      name: "Save the page",
      help: {
        title: "Save the page?",
        UI: [
          {
            element: "text",
            text: "Save the page?",
            header: true,
          },
          {
            element: "text",
            text: `With this, you can save the page even if you did not send the current one. There will be 1 page, and if the page limit is exceeded, it simply counts according to the latest available page.`,
          },
        ],
      },
    },
    "-",
    {
      element: "text",
      text: modVersion,
    },
  ],

  subtitle: (data, constants) => {
    return `Total: (${data.total}) | Elements on the page: (${data.pag})`;
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let total = parseInt(bridge.transf(values.total));
    let itensporpag = parseInt(bridge.transf(values.pag));

    if (itensporpag > 0) {
    } else {
      itensporpag = 10;
    }
    if (total > 0) {
    } else {
      total = 10;
    }

    let paginatotal = Math.ceil(total / itensporpag);

    bridge.store(values.storage, paginatotal);

    const storage2 = bridge.get(values.var);

    let valueiro = parseInt(storage2);

    if (valueiro > 0) {
    } else {
      valueiro = 0;
    }

    if (valueiro > paginatotal) {
      valueiro = paginatotal;
    }
    if (valueiro <= 0) {
      valueiro = 1;
    }

    let result = valueiro;
    bridge.store(values.storage2, result);

    let sessao = valueiro * itensporpag - itensporpag;
    bridge.store(values.storage3, sessao);
  },
};
