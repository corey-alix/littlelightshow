// app/fun/setMode.ts
var modes = {
  light_mode: "light",
  dark_mode: "dark",
  holiday_mode: "holiday"
};
function setMode(mode) {
  if (!mode)
    mode = localStorage.getItem("mode") || modes.light_mode;
  localStorage.setItem("mode", mode);
  document.body.classList.remove(...Object.values(modes));
  document.body.classList.add(mode);
}

// app/index.ts
function init() {
  setMode();
}
export {
  init
};
//# sourceMappingURL=index.js.map
