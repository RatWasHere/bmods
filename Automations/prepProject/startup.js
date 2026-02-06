module.exports = {
  run: (options) => {
    if (options.result) {
      let element = document.createElement("div")
      element.classList = "hoverablez option"
      element.innerHTML = `Prep`
      element.onclick = () => {
        options.eval('runAutomation("prepProject")')
      }
      element.id = "prepProjectQA"
      let elementAnchor = document.getElementById("commandExImQuickAccess")
      if (!elementAnchor) {
        elementAnchor = document.getElementById("collaborationStatus")
      }

      element.appendAfter(elementAnchor)
    }
  },
}
