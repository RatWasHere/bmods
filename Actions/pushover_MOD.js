const https = require("https");

module.exports = {
  category: "API",
  data: {
    name: "Pushover API",
  },
  info: {
    source: "https://github.com/LucxN/Pushover-API-BMD",
    creator: "Made with <3 by @lucxanul",
  },
  UI: [
    {
      element: "input",
      name: "Token",
      storeAs: "token",
    },
    "-",
    {
      element: "input",
      name: "User ID",
      storeAs: "user",
    },
    "-",
    {
      element: "input",
      name: "Title",
      storeAs: "title",
    },
    "-",
    {
      element: "var",
      name: "Message",
      storeAs: "message",
      also: {
        string: "Text",
      },
    },
    "-",
    {
      element: "toggle",
      name: "Priority",
      storeAs: "priority",
    },
    "-",
    {
      element: "condition",
      storeAs: "ifError",
      storeActionsAs: "ifErrorActions",
      name: "If Error",
    },
  ],

  subtitle: (data, constants) => {
    return `Send notifications to your devices using Pushover`;
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    try {
      const token = await bridge.transf(values.token);
      const user = await bridge.transf(values.user);
      const title = await bridge.transf(values.title);
      let messageContent;

      if (!token || !user) {
        throw new Error("Token and User ID are required");
      }

      if (values.message) {
        if (values.message.type === "string") {
          messageContent = String(await bridge.transf(values.message.value));
        } else {
          messageContent = String(await bridge.get(values.message));
        }
      } else if (values.dataValue) {
        messageContent = String(await bridge.transf(values.dataValue));
      } else {
        throw new Error("Message content is required");
      }

      if (typeof messageContent !== "string" || messageContent.length === 0) {
        throw new Error("Message content must be a non-empty string");
      }

      if (!messageContent) {
        throw new Error("Message content cannot be empty");
      }

      const response = await sendPushoverNotification({
        token,
        user,
        title,
        message: messageContent,
        priority: values.priority ? 1 : 0,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Pushover API Error:", error);
      bridge.runner(values.ifError, values.ifErrorActions);
    }
  },
};

async function sendPushoverNotification(data) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        params.append(key, data[key]);
      }
    }
    const payload = params.toString();

    const options = {
      hostname: "api.pushover.net",
      path: "/1/messages.json",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    try {
      const req = https.request(options, (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          try {
            const parsedResponse = responseData ? JSON.parse(responseData) : {};

            if (response.statusCode >= 200 && response.statusCode < 300) {
              resolve({ success: true, data: parsedResponse });
            } else {
              const errorMessage = parsedResponse.errors
                ? Object.values(parsedResponse.errors).join(", ")
                : `HTTP(S) error: ${response.statusCode}`;
              resolve({ success: false, error: errorMessage });
            }
          } catch (parseError) {
            console.error("Error:", parseError);
            resolve({ success: false, error: "Error from Pushover API" });
          }
        });

        response.on("error", (error) => {
          console.error("Error in response:", error);
          resolve({ success: false, error: "Network Error" });
        });
      });

      req.on("error", (error) => {
        console.error("Error sending notification:", error);
        resolve({
          success: false,
          error: "Failed to send notification to Pushover API",
        });
      });

      req.write(payload);
      req.end();
    } catch (error) {
      console.error("Error in request:", error);
      resolve({
        success: false,
        error:
          "Failed to initialize Pushover API request, mabye you should check the inputs again and again and again, just sayin",
      });
    }
  });
}
