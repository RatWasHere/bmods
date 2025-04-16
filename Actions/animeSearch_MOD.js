/*
  Anime Search mod by qschnitzel
  Licensed under MIT License

  Search for animes and get the best result with more details.
*/
module.exports = {
  data: {
    name: "Anime Search",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    donate: "https://ko-fi.com/qschnitzel",
  },
  category: "Anime",
  UI: [
    {
      element: "input",
      storeAs: "animeSearch",
      name: "Search for",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "title",
      name: "Title",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "japanesetitle",
      name: "Japanese Title",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "malid",
      name: "MAL ID",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "malurl",
      name: "MAL URL",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "image",
      name: "Cover Image",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "youtubetrailer",
      name: "Youtube Trailer URL",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "status",
      name: "Status",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "episodes",
      name: "Total Episodes",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "rating",
      name: "Rating",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "score",
      name: "Score",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "rank",
      name: "Rank",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "popularity",
      name: "Popularity",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "synopsis",
      name: "Synopsis",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "release",
      name: "Release Year",
    },
  ],

  async run(values, interaction, client, bridge) {
    const query = bridge.transf(values.animeSearch);
    await fetch(
      `https://api.jikan.moe/v4/anime?q=${query.replace(" ", "%20")}&sfw`
    ).then(async (response) => {
      const res = await response.json();
      let data = res.data[0];

      bridge.store(values.title, data.title);
      bridge.store(values.japanesetitle, data.title_japanese);
      bridge.store(values.malid, data.mal_id);
      bridge.store(values.malurl, data.url);
      bridge.store(values.image, data.images.jpg.large_image_url);
      bridge.store(values.youtubetrailer, data.trailer.url);
      bridge.store(values.status, data.status);
      bridge.store(values.episodes, data.episodes);
      bridge.store(values.rating, data.rating);
      bridge.store(values.score, data.score);
      bridge.store(values.rank, data.rank);
      bridge.store(values.popularity, data.popularity);
      bridge.store(
        values.synopsis,
        data.synopsis.replace("\n", "").replace("[Written by MAL Rewrite]", "")
      );
      bridge.store(values.release, data.year);
    });
  },
};
