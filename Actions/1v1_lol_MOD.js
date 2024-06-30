module.exports = {
  data: { name: "1v1.lol" },
  UI: [],
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "Rat",
  },
  category: "Memes",
  subtitle: "",
  script: (data) => {
    setTimeout(() => {
      console.log(data.document.getElementById("editorContent"));
      data.document.getElementById("editorContent").innerHTML = `
      <iframe src="https://1v1.lol" width="872" height="540" style="border: none;">
      `;
    }, 500);
  },
  async run(values, message, client, bridge) {},
};
