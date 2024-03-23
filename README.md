# Mods for [Bot Maker for Discord](https://store.steampowered.com/app/2592170/Bot_Maker_For_Discord/)

This repository serves to house mods made by the community for BMD.

## Installation

### Using Install-mods.bat

- Requirement: [Git](https://git-scm.com) and Windows

1. Right click and run as administrator and done!

### Using CLI tool

- Requirement: [Node.JS](https://nodejs.org/en)

1. Use npm to install [bmdm](https://github.com/qizzle/bmdm)

```bash
npm i -g bmdm
```

2. Set your path to Bot Maker for Discord

```bash
bmdm set "<PATH>"
```

> e.g. bmdm set "C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord"

3. Use **bmdm** to install mods

```bash
bmdm all
```

> This will install all offical mods

**or**

```bash
bmdm install <mod>
```

> e.g. bmdm install animesearch

4. You're all set!

**For more about usage of bmdm look into the [offical repository](https://github.com/qizzle/bmdm?tab=readme-ov-file#usage)**.

### Manual

1. Download this repository by pressing "Code" and then selecting "Download ZIP" on the repository's home page.
2. Extract the ZIP archive.
3. Place the "Actions" folder into your Bot Maker for Discord's AppData directory. _(e.g. C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData)_
4. Place the "Themes" folder into the main directory of your Bot Maker for Discord installation. _(e.g. C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord)_
5. Restart (or CTRL + R) the program
6. You're all set!

## Creating Mods

See the [short documentation](https://github.com/RatWasHere/bmods/blob/master/MODS.md).

## Contact

Feel free to join our [Discord server](https://discord.gg/whtjS7BW3u).

## License

Distributed under the [MIT License](https://github.com/RatWasHere/bmods/blob/master/LICENSE).
