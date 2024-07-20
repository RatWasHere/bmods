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
