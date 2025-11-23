module.exports = {
  run: (options) => {
    if (options.result) {
      let element = document.createElement("div")
      element.classList = "hoverablez option"
      element.innerHTML = `Export/Import`
      element.onclick = () => {
        options.eval('runAutomation("commandExIm")')
      }
      element.id = "commandExImQuickAccess"

      element.appendAfter(document.getElementById("collaborationStatus"))
    }
  },
}
