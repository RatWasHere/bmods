modVersion = "v1.0.0"
module.exports = {
  data: {
    name: "Delete File From GitHub",
    branch: "main"
  },
  aliases: [],
  modules: ["node:fs", "node:path"],
  category: "WebAPIs",
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Actions",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  UI: [
    {
      element: "input",
      storeAs: "owner",
      name: "Repository Owner"
    },
    {
      element: "input",
      storeAs: "repository",
      name: "Repository",
    },
    {
      element: "input",
      storeAs: "branch",
      name: "Branch",
    },
    {
      element: "input",
      storeAs: "remotePath",
      name: "File Path On GitHub",
      placeholder: "path/to/file.ext"
    },
    {
      element: "input",
      storeAs: "token",
      name: "GitHub User Token",
      placeholder: "https://github.com/settings/tokens"
    },
    "-",
    {
      element: "store",
      storeAs: "resp",
      name: "Store Response As",
    },
    "-",
    {
      element: "text",
      text: modVersion
    }
  ],

  subtitle: (values, constants, thisAction) =>{ // To use thisAction, constants must also be present
    return `Delete Content (${values.remotePath}) From GitHub`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const fs = require("node:fs")
    const path = require("node:path")

    let owner = bridge.transf(values.owner).trim()
    let repo = bridge.transf(values.repository).trim()
    let branch = bridge.transf(values.branch).trim()
    let remotePath = bridge.transf(values.remotePath).trim()
    let token = bridge.transf(values.token).trim()

    if (!owner || !repo || !branch || !remotePath || !token){
      return bridge.store(values.resp, `Missing Fields!`)
    }

    if (remotePath.startsWith("/")){
      remotePath = remotePath.slice(1)
    }
    remotePath = remotePath.replaceAll("..", ".")

    let apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${remotePath}`

    try{
      const lookupResponse = await fetch(`${apiUrl}?ref=${branch}`,{
        headers:{
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        }
      })

      let lookupResult = await lookupResponse.json()
      if (!lookupResponse.ok){
        return bridge.store(values.resp, `File Lookup Failed: ${lookupResult.message}`)
      }

      const sha = lookupResult.sha

      const deleteResponse = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Delete ${remotePath} via Bot`,
          branch,
          sha
        })
      })

      let deleteResult = await deleteResponse.json()
      if(!deleteResponse.ok){
        bridge.store(values.resp, `GitHub Error: ${deleteResult.message}`)
        return
      }

      bridge.store(values.resp, `Delete Success: ${remotePath}`)
    } catch (error){
      bridge.store(values.resp, `Delete Failed: ${error.message}`)
    }
  }
}