var t={light_mode:"light",dark_mode:"dark",holiday_mode:"holiday"};function e(o){o||(o=localStorage.getItem("mode")||"holiday"),localStorage.setItem("mode",o),document.body.classList.remove(...Object.values(t)),document.body.classList.add(o)}e(localStorage.getItem("mode")||t.holiday_mode);function i(){e()}export{i as init};
//# sourceMappingURL=index.js.map
