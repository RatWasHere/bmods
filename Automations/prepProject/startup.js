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
      const anchorIds = ["commandExImQuickAccess", "commandExImQA", "collaborationStatus"]

      const elementAnchor = anchorIds.reduce((found, id) => found || document.getElementById(id), null)

      if (elementAnchor) element.appendAfter(elementAnchor)
    }
  },
}
