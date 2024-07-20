# Community Mods for [Bot Maker for Discord](https://store.steampowered.com/app/2592170/Bot_Maker_For_Discord/)

This repository houses community-made mods for Bot Maker for Discord (BMD).

## Navigation

- [Installation](#installation)
  - [Using the CLI Tool](#using-the-cli-tool)
  - [Manual Installation](#manual-installation)
  - [Using `Install-mods.bat`](#using-install-modsbat-not-recommended)
- [Creating Mods](#creating-mods)
- [Uploading Mods via GitHub Pull Requests](#uploading-mods-via-github-pull-requests)
  - [Using the Web Interface](#using-the-web-interface)
  - [Using the Local Machine](#using-the-local-machine)
- [Contact](#contact)
- [License](#license)

## Installation

### Using the CLI Tool

[_Work in Progress (W.I.P.)_](https://github.com/qizzle/bmdm)
BMD built-in mod manager coming soon™️

### Manual Installation

1. Download the repository by clicking "Code" on the repository's home page and selecting "Download ZIP".
2. Extract the ZIP archive.
3. Move the "Actions" folder to your Bot Maker for Discord's AppData directory, typically located at:
   ```
   C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData
   ```
4. Move the "Themes" folder to the main directory of your Bot Maker for Discord installation, typically located at:
   ```
   C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord
   ```
5. Restart the Bot Maker for Discord application.
6. You're all set!

## Creating Mods

> [!IMPORTANT]
> Refer to the [short documentation](https://github.com/RatWasHere/bmods/blob/master/MODS.md) for guidance on creating your own mods.

Please follow the general structure when creating mods. Therefore, add **\_MOD** after your mod name, don't include any additional dots or spaces, and make sure to include the info object within your modded action.
Feel free to add a short description for your action as seen in [**animeSearch_MOD.js**](https://github.com/RatWasHere/bmods/blob/master/Actions/animeSearch_MOD.js).

## Uploading Mods via GitHub Pull Requests

To contribute your mods to this repository, you can use either the GitHub web interface or your local machine.

### Using the Web Interface

1. **Fork the Repository**: Click on the "Fork" button at the top right corner of this repository to create a copy in your own GitHub account.
2. **Navigate to Your Fork**: Go to your forked repository on GitHub.
3. **Create a New File or Edit an Existing File**: Click on "Add file" and select "Create new file" or navigate to the file you want to edit and click the pencil icon to edit it.
4. **Add Your Mod**: Add your mod code in the editor.
5. **Commit Changes**: Scroll down to the "Commit new file" or "Commit changes" section, add a commit message, and click "Commit new file" or "Commit changes".
6. **Create a Pull Request**: Go back to the original repository and click on the "New Pull Request" button. Select your fork and branch, then click "Create Pull Request". Add a description and submit the pull request.

### Using the Local Machine

1. **Fork the Repository**: Click on the "Fork" button at the top right corner of this repository to create a copy in your own GitHub account.
2. **Clone Your Fork**: Clone your fork to your local machine using:
   ```bash
   git clone https://github.com/<your-username>/bmods.git
   ```
3. **Create a New Branch**: Create a new branch for your mod:
   ```bash
   cd bmods
   git checkout -b my-new-mod
   ```
4. **Add Your Mod**: Add your mod files to the appropriate directory (e.g., `Actions` or `Themes`).
5. **Commit Your Changes**: Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "Add my new mod"
   ```
6. **Push to Your Fork**: Push your branch to your forked repository:
   ```bash
   git push origin my-new-mod
   ```
7. **Create a Pull Request**: Go to the original repository and click on the "New Pull Request" button. Select your branch and create the pull request.

## Contact

Join our community on the [Discord server](https://discord.gg/whtjS7BW3u) for support and discussion.

## License

This project is distributed under the [MIT License](https://github.com/RatWasHere/bmods/blob/master/LICENSE).
