/*
  Get Tags from Gelbooru Post mod by qschnitzel
  Licensed under MIT License

  Gets all the tags from a Gelbooru post. Great for creating prompts.
  (god, please forgive my sins)

  more danbooru & gelbooru actions soon™️
*/

module.exports = {
  data: {
    name: "Get Tags from Gelbooru Post",
  },
  category: "NSFW",
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Gelbooru Post ID/URL",
    },
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store tags",
    },
  ],

  async run(values, interaction, client, bridge) {
    const id = bridge.transf(values.id);

    try {
      var tags = await getTags(id);
    } catch (err) {
      bridge.store(values.store, "no tags");
      return;
    }

    bridge.store(values.store, tags);
  },
};

async function streamToString(stream) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

async function getTags(postId) {
  const url = "https://gelbooru.com/index.php?page=dapi&q=index&json=1";

  // thanks chatgpt for the regex pattern 🙏
  const id = postId.replace("json=1", "").replace(/(?:%(\d+)|\D)/g, "");
  const response = await fetch(`${url}&s=post&id=${id}`);

  const content = JSON.parse(await streamToString(response.body));
  return content.post[0].tags;
}
