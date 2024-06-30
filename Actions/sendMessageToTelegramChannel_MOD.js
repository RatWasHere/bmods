module.exports = {
  data: {
    name: "Send Message To Telegram Channel MOD",
  },
  category: "Messages",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "tao",
  },
  UI: [
    {
      element: "input",
      storeAs: "token",
      name: "Telegram Bot Token",
      placeholder: "Enter your telegram bot token here",
    },
    "-",
    {
      element: "input",
      storeAs: "chat_id",
      name: "Telegram Chat ID",
      placeholder: "Chat IDs always start with -",
    },
    "-",
    {
      element: "largeInput",
      storeAs: "text",
      name: "Message Content",
    },
  ],

  async run(values, interaction, client, bridge) {
    const axios = require("axios");
    const token = bridge.transf(values.token);
    const chat_id = bridge.transf(values.chat_id);
    const msg = bridge.transf(values.text);
    const api = bridge.transf(
      `https://api.telegram.org/bot${token}/sendMessage`
    );

    const options = {
      method: "POST",
      url: api,
      data: {
        text: msg,
        parse_mode: "markdown",
        disable_web_page_preview: false,
        disable_notification: false,
        reply_to_message_id: null,
        chat_id: `${chat_id}`,
      },
    };
    axios.request(options);
  },
};
