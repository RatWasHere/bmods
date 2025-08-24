modVersion = "v1.0.1"
module.exports = {
  data: {
    name: "Upload File To GitHub",
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
      element: "typedDropdown",
      storeAs: "upload",
      name: "Upload Type",
      choices: {
        file: {name: "File", field: true, placeholder: "path/to/file.ext"},
        content: {name: "Content", field: true, placeholder: "Content"},
      },
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
    return `Upload Content (${values.upload.value}) To GitHub`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge){ // This is the exact order of things required, other orders will brick
    for (const moduleName of this.modules){
      await client.getMods().require(moduleName)
    }

    const fs = require("node:fs")
    const path = require("node:path")

    let uploadType = bridge.transf(values.upload.type)
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

    let content
    if (uploadType == "file"){
      let relativePath = path.normalize(bridge.transf(values.upload.value))

      const botData = require("../data.json")
      const workingDir = path.normalize(process.cwd())
      let projectFolder
      if (workingDir.includes(path.join("common", "Bot Maker For Discord"))){
        projectFolder = botData.prjSrc
      } else {projectFolder = workingDir}

      let fullPath = path.join(projectFolder, relativePath)
      if(fs.existsSync(fullPath)){
        content = fs.readFileSync(fullPath)
      } else {
        return `"${fullPath}" Does Not Exist!`
      }
    } else if (uploadType == "content") {
      content = bridge.transf(values.upload.value)
    }

    let contentEncoded = Buffer.from(content, "utf-8").toString("base64")

    try {
      let sha = undefined
      const checkResponse = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        }
      })

      if (checkResponse.ok){
        const existing = await checkResponse.json()
        sha = existing.sha
      }

      const uploadResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Upload ${remotePath} via Bot`,
          content: contentEncoded,
          branch,
          ...(sha ? {sha} : {})
        })
      })

      const result = await uploadResponse.json()
      if (!uploadResponse.ok){
        bridge.store(values.resp, `GitHub Error: ${result.message}`)
        return
      }

      bridge.store(values.resp, `https://github.com/${owner}/${repo}/blob/${branch}/${remotePath}`)
    } catch (error) {
      bridge.store(values.resp, `Upload Failed: ${error.message}`)
    }
  }
}