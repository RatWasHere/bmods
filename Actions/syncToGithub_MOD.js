const path = require('path');
const fs = require('fs');


module.exports = {
  category: "API",
  aliases: ["Sync to GitHub", "GitHub Sync", "Repository Sync", "Sync Github", "Push To Github", "Push", "GitHub"],
  data: {
    name: "Sync to GitHub",
  },
  info: {
    source: "github.com/LucxN/SyncToGitHub-BMD",
    creator: "Made with <3 by Lucxanul",
    sogg: "https://i.ibb.co/5g82ZRst/l1vvubg7k7j81.webp",
  },
  UI: [
    {
      element: "input",
      storeAs: "token",
      name: "GitHub Token",
      placeholder: "Enter your GitHub token"
    },
    "-",
    {
      element: "input",
      storeAs: "repository",
      name: "Repository",
      placeholder: "username/repository"
    },
    "-",
    {
      element: "input",
      storeAs: "botFolder",
      name: "Bot Folder",
      placeholder: "Path to bot folder"
    },
    "-",
    {
      element: "input",
      storeAs: "actionsFolder",
      name: "Actions Folder",
      placeholder: "Path to Actions folder"
    },
    "-",
    {
      element: "text",
      text: "For your GitHub Token go to Github > Settings > Developer settings > Personal access tokens > Tokens(classic).<br>Make sure you give the token enough permissions.<br>For the paths NEVER use backslash('\\'), use slash('/') <br>MAKE SURE THE GITHUB REPO YOU ARE SYNCING TO IS PRIVATE! THE PUSH CONTAINS BOTH YOUR DISCORD & GITHUB TOKEN AND WILL GET THEM REVOKED. <br>For any other problems message me on discord @lucxanul."
    }
  ],

  subtitle: (data) => {
    return `Sync project to GitHub repository`;
  },

  async run(values, message, client, bridge) {
    try {
      const simpleGit = await client.getMods().require('simple-git');
      const token = bridge.transf(values.token);
      const botFolderPath = bridge.transf(values.botFolder);
      const actionsFolderPath = bridge.transf(values.actionsFolder);

      if (!token || !botFolderPath || !actionsFolderPath || !values.repository) {
        throw new Error('Need all the fields filled out (token, folders, repo)')
      }

      if (!fs.existsSync(botFolderPath)) {
        throw new Error(`Can't find bot folder: ${botFolderPath}`);
      }
      if (!fs.existsSync(actionsFolderPath)) {
        throw new Error(`Can't find actions folder: ${actionsFolderPath}`);
      }

      const git = simpleGit({
        baseDir: botFolderPath,
        binary: 'git',
        maxConcurrentProcesses: 6, // 6 best value
      });

      try {
        await git.init();

        const branches = await git.branchLocal();
        
        if (!branches.all.includes('main')) {
          // create inital commit if repo is empty
          const status = await git.status();
          if (status.not_added.length > 0) {
            await git.add('.');
            await git.commit('Initial commit');
            console.log('Inital commit created');
          }
          await git.checkoutLocalBranch('main');
        }
      } catch (error) {
        console.log('Checking if main branch exists...');
        await git.checkout('main');
        console.log('Switched to main branch');
      }

      // Git push info
      await git.addConfig('user.name', 'Synced from BMD', false);
      await git.addConfig('user.email', 'github@bmdmod.com', false);

      try {
        const response = await fetch(`https://api.github.com/repos/${values.repository}`, {
          headers: { 'Authorization': `token ${token}` }
        });
        
        if (response.status === 404) {
          throw new Error('Repo not found! You sure you created it first?');
        }


        const remoteUrl = `https://${token}@github.com/${values.repository}.git`;
        await git.removeRemote('origin').catch(() => {});
        await git.addRemote('origin', remoteUrl);
        console.log('Connected to repository:', `https://github.com/${values.repository}.git`);
      } catch (error) {
        console.error('Something went wrong with GitHub setup:', error);
        throw error;
      }
      
      console.log('Looking for changes in actions folder...');
      const actionsDestPath = path.join(botFolderPath, 'AppData/Actions');
      

      if (!fs.existsSync(actionsDestPath)) {
        fs.mkdirSync(actionsDestPath, { recursive: true });
      }
      
      // delete old actions to avoid conflict
      if (fs.existsSync(actionsDestPath)) {
        fs.rmSync(actionsDestPath, { recursive: true, force: true });
      }
      fs.mkdirSync(actionsDestPath, { recursive: true });


      const copyFiles = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        entries.forEach(entry => {
          if (entry.name === '.git' || entry.name === '.gitmodules' || entry.name === '.gitattributes') return;
          
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            copyFiles(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        });
      };
      
      copyFiles(actionsFolderPath, actionsDestPath);
      
      await git.add('AppData/Actions');
    
      const status = await git.status();
      
      console.log('Checking what changed...');
      console.log('Changed files:', status.modified);
      console.log('New files:', status.not_added);
      console.log('Deleted files:', status.deleted);
      
      if (status.modified.length === 0 && 
          status.not_added.length === 0 && 
          status.deleted.length === 0) {
        console.log('No changes detected, stopping sync');
        return;
      }


      if (status.deleted.length > 0) {
        // Process each deleted file individually
        for (const file of status.deleted) {
          try {
            await git.rm(['-f', file]);
            console.log(`Removed ${file} successfully!`);
          } catch (error) {
            console.log(`Couldn't remove ${file}, error: ${error.message}`);
          }
        }
      }

      // add all the changes in smaller chunks
      const filesToStage = [...status.modified, ...status.not_added];
      const batchSize = 50; // adjust this number as needed
      for (let i = 0; i < filesToStage.length; i += batchSize) {
        const batch = filesToStage.slice(i, i + batchSize);
        if (batch.length > 0) {
          await git.add(batch);
        }
      }


      await git.rm(['-r', '--cached', 'AppData/Actions']).catch(() => {});
      await git.add('AppData/Actions');
      
      console.log('Actions synced successfully!');

      try {
        await git.commit('Updated from BMD');
        await git.push(['origin', 'main', '--force']); // force push to overwrite rep
        console.log('Synced everything to GitHub successfully!');
      } catch (error) {
        console.error('Sync failed:', error.message);
        if (message && message.channel) {
          message.channel.send(`Failed to sync: ${error.message}`).catch(console.error);
        }
      }

      console.log('Successfully synced changes to GitHub');

    } catch (error) {
      console.error('Error syncing to GitHub:', error);
      if (message && message.channel) {
        message.channel.send(`Sync failed: ${error.message}`).catch(console.error);
      }
    }
  },
};