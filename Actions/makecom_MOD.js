const http = require("http");
const https = require("https");

module.exports = {
  category: "API",
  data: {
    name: "Make.com",
  },
  info: {
    source: "https://github.com/LucxN",
    creator: "Made with <3 by @lucxanul",
  },
  UI: [
    {
      element: "dropdown",
      name: "Server",
      storeAs: "region",
      choices: [
        { name: "EU1" },
        { name: "EU2" },
        { name: "US1" },
        { name: "US2" },
      ],
    },
    "-",
    {
      element: "input",
      name: "Webhook ID",
      storeAs: "webhook_id",
    },
    "-",
    {
      element: "var",
      name: "Store Command Status",
      storeAs: "statusCode",
    },
    {
      element: "text",
      text: "Create a Webhook in Make.com and give it a immediate 'as data arrives' schedule setting.",
    },
  ],

  subtitle: (data, constants) => {
    return `Send webhook to Make.com (${data.region})`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const regionObj = await bridge.transf(values.region);
    const region = regionObj && regionObj.name ? regionObj.name : values.region;
    const webhook_id = await bridge.transf(values.webhook_id);

    try {
      const response = await sendMakeWebhook(region, webhook_id);

      if (values.statusCode && response.statusCode !== undefined) {
        await bridge.store(values.statusCode, response.statusCode);
      }

      if (!response.success) {
        throw new Error(response.error || "Connection to host has failed");
      }
    } catch (error) {
      console.error("Make.com Error:", error);
    }
  },
};

async function sendMakeWebhook(region, webhook_id) {
  return new Promise((resolve) => {
    const formattedRegion = region.toString().toLowerCase();
    const url = `https://hook.${formattedRegion}.make.com/${webhook_id}`;

    const urlObj = new URL(url);

    const data = JSON.stringify({
      timestamp: new Date().toISOString(),
      source: "BMD",
    });

    // Change user agent to something like 'Chrome' if doing many requests.
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: "POST",
      rejectUnauthorized: false,
      headers: {
        "User-Agent": "BMD",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    try {
      const req = https.request(options, (response) => {
        let responseData = "";
        const statusCode = response.statusCode || 0;

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          let result;
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {};
            if (statusCode >= 200 && statusCode < 300) {
              result = {
                success: true,
                data: parsedData,
                statusCode: statusCode,
              };
            } else {
              result = {
                success: false,
                error: `HTTP error, status: ${statusCode}`,
                statusCode: statusCode,
              };
            }
          } catch (parseError) {
            console.error("Parseing response error:", parseError);
            result = {
              success: statusCode >= 200 && statusCode < 300,
              data: responseData,
              statusCode: statusCode,
              error:
                statusCode >= 200 && statusCode < 300
                  ? null
                  : `HTTP error! status: ${statusCode}`,
            };
          }
          resolve(result);
        });

        response.on("error", (error) => {
          console.error("Error in response:", error);
          resolve({ success: false, error: error.message, statusCode: 0 });
        });
      });

      req.on("error", (error) => {
        console.error("Error sending webhook:", error);
        resolve({ success: false, error: error.message, statusCode: 0 });
      });

      req.write(data);
      req.end();
    } catch (error) {
      console.error("Error in request setup:", error);
      resolve({ success: false, error: error.message, statusCode: 0 });
    }
  });
}
