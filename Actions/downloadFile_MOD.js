module.exports = {
  data: {
    name: "Download File",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "candiedapple",
  },
  category: "Files",
  UI: [
    {
      element: "input",
      storeAs: "url",
      name: "File URL",
      placeholder: "https://domain.com/file.txt",
    },
    "-",
    {
      element: "input",
      storeAs: "filepath",
      name: "File Path",
      placeholder: "folder/downloaded_file.txt",
    },
  ],

  run(values, interaction, client, bridge) {
    const https = require("https");
    const fs = require("fs");
    const path = require("path");

    // Function to create folders recursively
    function createFolders(folderPath) {
      // Normalize folder path to handle different OS file separators
      folderPath = path.normalize(folderPath);
      // Create folders recursively
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Function to download file from a URL
    function downloadFile(url, destination) {
      return new Promise((resolve, reject) => {
        // Extract directory from destination path
        const directory = path.dirname(destination);
        // Create directory if it does not exist
        createFolders(directory);

        const file = fs.createWriteStream(destination);
        https
          .get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
              file.close(resolve(true));
            });
          })
          .on("error", (error) => {
            fs.unlink(destination);
            reject(error.message);
          });
      });
    }

    // Example usage:
    const fileUrl = bridge.transf(values.url); // URL of the file to download
    const destinationPath = bridge.transf(values.filepath); // Path where the file will be saved

    downloadFile(fileUrl, destinationPath)
      .then(() => {})
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  },
};
