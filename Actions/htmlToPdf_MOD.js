/*
  If any bug happens or you want a feature added feel free to reach me through Discord: Maco (search in bmd server)
*/

module.exports = {
  data: {
    name: "Html To Pdf",
  },
  category: "File",
  info: {
    source: "Uses html-pdf-node",
    creator: "Maco",
    description: "This mod converts HTML files into PDF using puppeteer, please provide a path to an existing HTML file and a path to where the generated PDF will be created.",
  },

  UI: [
    {
      element: "text",
      text: "Convert full HTML pages into PDF.",
    },
    {
      element: "input",
      name: "Input HTML file path:",
      placeholder: "C:/path/to/file.html",
      storeAs: "htmlPath",
      variable: "htmlPath"
    },
    {
      element: "input",
      name: "Output PDF file path:",
      placeholder: "C:/path/to/output.pdf",
      storeAs: "pdfPath",
      variable: "pdfPath"
    },
  ],

  async run(values, message, client, bridge) {
    try {
        const path = require("path");

        const htmlPath = bridge.file(values.htmlPath);
        const pdfPath = bridge.file(values.pdfPath);

        const absoluteHtmlPath = path.resolve(htmlPath);
        const safePath = absoluteHtmlPath.replace(/\\/g, "/");
        const fileUrl = `file:///${safePath}`;

        const puppeteer = await client.getMods().require("puppeteer");

        const browser = await puppeteer.launch({
            headless: "new", 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const page = await browser.newPage();
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        const totalPages = await page.evaluate(() => {
            const pageHeightPx = 1122;  // A4 Format Pixel Height
            return Math.ceil(document.body.scrollHeight / pageHeightPx);
        });

        await page.pdf({
            path: pdfPath,
            printBackground: true,
            format: "A4", 
            preferCSSPageSize: true,
            pageRanges: `1-${totalPages}`
        });

        await browser.close();
        

        console.log("✅ PDF generated:", pdfPath);
    } catch (err) {
        console.error("Error during PDF generation:", err);
    }
  },
};
