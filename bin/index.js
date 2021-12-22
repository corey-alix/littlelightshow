var t={light_mode:"light",dark_mode:"dark",holiday_mode:"holiday"};function e(o){o||(o=localStorage.getItem("mode")||t.light_mode),localStorage.setItem("mode",o),document.body.classList.remove(...Object.values(t)),document.body.classList.add(o)}function s(){e()}export{s as init};
//# sourceMappingURL=index.js.map
