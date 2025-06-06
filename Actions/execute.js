modVersion = "v1.2.0 | AceFix"
module.exports = {
  data: {
    name: "Execute",
  },
  info: {
    source: "https://github.com/slothyace/bmods-acedia/tree/main/Fixes",
    creator: "Acedia Fixes",
    donate: "https://ko-fi.com/slothyacedia"
  },
  UI: [
    {
      element: "largeInput",
      storeAs: "command",
      name: "Command",
      max: 5000000
    },
    {
      element: "toggle",
      storeAs: "newProc",
      name: "Start As New Detached Process?"
    },
    "-",
    {
      element: "storage",
      storeAs: "result",
      name: "Store Result As"
    },
    {
      element: "text",
      text: modVersion,
    }
  ],
  category: "Control",
  subtitle: (values, constants) => {
    return `Store Result As: ${constants.variable(values.result)}`
  },

  async run(values, command, client, bridge) {
    await client.getMods().require("node:child_process")
    const childProcess = require('child_process')
    let toExec = bridge.transf(values.command)

    if (values.newProc == true){
      await new Promise((res) => {
        const child = childProcess.spawn(toExec, {shell: true, detached: true, stdio: "ignore"})
    
        child.on("error", (err) => {
          bridge.store(values.result, `Failed to start: ${err.message}`)
          return res()
        })
    
        child.on("spawn", () => {
          bridge.store(values.result, `New Process Started With PID: ${child.pid}`)
          child.unref()
          return res()
        })
      })
    } else {
      await new Promise((res, rej) => {
        
        childProcess.exec(toExec, (error, stdout, stderr) => {
          if (error) {
            bridge.store(values.result, `Error: ${error.message}`)
            return res()
          }
          if (stderr) {
            bridge.store(values.result, `Stderr: ${stderr}`)
            return res()
          }
          bridge.store(values.result, stdout)
          res()
        })
      })
    }
  }
}
