/*
  Get Tags from Danbooru Post mod by qschnitzel
  Licensed under MIT License

  Gets all the tags from a Danbooru post. Great for creating prompts.
*/

module.exports = {
  data: {
    name: "Get Tags from Danbooru Post",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "NSFW",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Danbooru Post ID/URL",
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
      const tags = await getTags(id);
      var stringed = tags.toString();
    } catch (err) {
      bridge.store(values.store, "no tags");
      return;
    }

    bridge.store(values.store, stringed);
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
  var tags = [];
  const url = "https://danbooru.donmai.us";

  // thanks chatgpt for the regex pattern 🙏
  const id = postId.replace(/(?:%(\d+)|\D)/g, "");
  const response = await fetch(`${url}/posts/${id}`);

  const content = await streamToString(response.body);

  const splitStart = content.split('<ul class="general-tag-list">')[1];
  const splitEnd = splitStart.split("</ul>")[0];
  const splitByTag = splitEnd.split("</li>");

  for (let index in splitByTag) {
    try {
      tags.push(splitByTag[index].split('&amp;z=1">')[1].split("</a>")[0]);
    } catch (err) {}
  }

  return tags;
}
