module.exports = {
  data: {
    name: "Get SFTP File",
  },
  category: "Files",
  info: {
    source: "https://github.com/ratWasHere/bmods",
    creator: "TheMonDon",
    donate: "https://cisn.xyz/donate",
  },
  UI: [
    {
      element: "inputGroup",
      nameSchemes: ["Host", "Port"],
      storeAs: ["host", "port"],
      placeholder: ["127.0.0.1", "22"],
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Username", "Password"],
      storeAs: ["username", "password"],
      placeholder: ["admin", "password"],
    },
    "-",
    {
      element: "input",
      name: "Local File Path",
      storeAs: "localFilePath",
      placeholder:
        "Path to save the file locally, e.g., /path/to/local/file.txt",
    },
    "-",
    {
      element: "input",
      name: "Remote File Path",
      storeAs: "remoteFilePath",
      placeholder:
        "Path of the file on the SFTP server, e.g., /path/to/remote/file.txt",
    },
  ],
  compatibility: ["Any"],

  subtitle: (data) => {
    return `Host: "${data.host}" | Local Path: "${data.localFilePath}" | Remote Path: "${data.remoteFilePath}"`;
  },

  run: async (values, command, client, bridge) => {
    try {
      const SftpClient = await client.getMods().require("ssh2-sftp-client");
      let sftp = new SftpClient();

      // Check for missing required fields
      if (
        !values.host ||
        !values.port ||
        !values.username ||
        !values.password ||
        !values.localFilePath ||
        !values.remoteFilePath
      ) {
        return console.error(
          "Missing required fields in get sftp file. Please ensure all fields are filled out."
        );
      }

      const fs = require("fs");
      const remoteFilePath = bridge.transf(values.remoteFilePath);
      const localFilePath = fs.createWriteStream(
        bridge.transf(values.localFilePath)
      );

      sftp
        .connect({
          host: bridge.transf(values.host),
          port: bridge.transf(values.port),
          username: bridge.transf(values.username),
          password: bridge.transf(values.password),
        })
        .then(() => {
          return sftp.get(remoteFilePath, localFilePath);
        })
        .then(() => {
          sftp.end();
        })
        .catch((err) => {
          console.log("Error getting file from sftp", err);
        });
    } catch (error) {
      const errorMsg = `Error getting file from sftp: ${error.message}`;
      console.error(errorMsg, error);
    }
  },
};
