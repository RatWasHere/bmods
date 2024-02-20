/*
  Get Random Hentai mod by qschnitzel
  Licensed under MIT License

  god please god please god please god please god please god please god please god please god please
*/

module.exports = {
  data: {
    name: "Get Random Hentai",
  },
  category: "NSFW",
  UI: [
    {
      element: "input",
      storeAs: "tags",
      name: "Tags",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "storeImage",
      name: "Store image",
    },
    {
      element: "storageInput",
      storeAs: "storeTitle",
      name: "Store title",
    },
    {
      element: "storageInput",
      storeAs: "storeTags",
      name: "Store tags",
    },
    {
      element: "storageInput",
      storeAs: "storeId",
      name: "Store id",
    },
    {
      element: "storageInput",
      storeAs: "storeOwner",
      name: "Store owner",
    },
    {
      element: "storageInput",
      storeAs: "storeCreatorID",
      name: "Store creator id",
    },
  ],

  async run(values, interaction, client, bridge) {
    const tags = bridge.transf(values.tags);

    const url = "https://gelbooru.com/index.php?page=dapi&q=index&json=1";

    const response = await fetch(
      `${url}&s=post&tags=sort:random%20${tags}&limit=1`
    );

    const content = JSON.parse(await streamToString(response.body));
    bridge.store(values.storeImage, content.post[0].file_url);
    bridge.store(values.storeTitle, content.post[0].title);
    bridge.store(values.storeTags, content.post[0].tags);
    bridge.store(values.storeId, content.post[0].id);
    bridge.store(values.storeOwner, content.post[0].owner);
    bridge.store(values.storeCreatorID, content.post[0].creator_id);
  },
};

async function streamToString(stream) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}
