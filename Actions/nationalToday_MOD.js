/*
    National Today mod by qschnitzel
    Licensed under MIT License

    Get todays holidays using nationaltoday.com
*/
module.exports = {
  data: {
    name: "National Today",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    description: "Get todays holidays using nationaltoday.com",
  },
  modules: ["jsdom"],
  category: "API",
  UI: [
    {
      element: "storageInput",
      storeAs: "store",
    },
    {
      element: "html",
      html: `
      <style>
      code {
        padding: 2px 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      .info {
        margin: 8px 0 8px 8px;
        font-size: 14px;
      }
      </style>
      <p class="info">Returns an Array with Objects containing <code>title</code> and <code>category</code> properties.</p>`,
    },
  ],

  async run(values, interaction, client, bridge) {
    const jsdom = await client.getMods().require("jsdom");

    const { JSDOM } = jsdom;

    try {
      var data = [];
      const dom = await JSDOM.fromURL("https://nationaltoday.com/today");
      const holidays = dom.window.document.querySelectorAll(".card-holiday");

      for (const holiday of holidays) {
        const title = holiday.querySelector(".card-holiday-title").textContent;
        const category = holiday.querySelector(".card-holiday-categories")
          .children[0].textContent;
        data.push({ title, category });
      }
      bridge.store(values.store, data);
    } catch (error) {
      console.log("NationToday ->", error);
    }
  },
};
