const helpPrompt = document.getElementById("help-prompt")
const nextPage = document.getElementById("next-page")

helpPrompt.addEventListener('click', function () {
  nextPage.classList.toggle("showing")
})