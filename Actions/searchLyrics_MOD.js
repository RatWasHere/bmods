/*
  Search Lyrics mod by qschnitzel
  Licensed under MIT License

  Use lrclib.net to search for lyrics of a song.
*/

module.exports = {
  data: {
    name: "Search Lyrics",
  },
  info: {
    source: "https://github.com/RatWasHere/bmods/tree/master/Actions",
    creator: "qschnitzel",
    description: "Use lrclib.net to search for lyrics of a song.",
  },
  category: "API",
  UI: [
    {
      element: "input",
      storeAs: "text",
      name: "Query",
      placeholder: "Never Gonna Give You Up - Rick Astley",
    },
    "-",
    {
      element: "storageInput",
      storeAs: "result",
      name: "Store Result",
    },
    "-",
    {
      element: "html",
      html: `
        <div style="margin: 12px 12px;">
            The result will be stored as an Array of max. 20 lyrics objects.
            Each object contains the following properties:
            <ul>
            <li><code>id</code>: The id of the song in the LRCLIB Database.</li>
            <li><code>name</code>: The name of the song.</li>
            <li><code>trackName</code>: The track name of the song.</li>
            <li><code>artistName</code>: The artist name of the song.</li>
            <li><code>albumName</code>: The album name of the song.</li>
            <li><code>duration</code>: The duration of the song.</li>
            <li><code>instrumental</code>: Either <code>true</code> or <code>false</code>.</li>
            <li><code>plainLyrics</code>: The plain lyrics of the song.</li>
            <li><code>syncedLyrics</code>: The lyrics of the song with timestamps.</li>
            </ul>
            <p>Note: The <code>syncedLyrics</code> property is only available if the song has synced lyrics.</p>
            <br>
            You can use the result by using <code>$ {tempVars('VARIABLENAME')[0].property}</code> to access the first song in the result.
        </div>
        `,
    },
  ],

  async run(values, interaction, client, bridge) {
    const query = bridge.transf(values.text);
    const url = `https://lrclib.net/api/search?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    bridge.store(values.result, data);
  },
};
