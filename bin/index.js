var e={light_mode:"light",dark_mode:"dark",holiday_mode:"holiday"};function t(o){o||(o=localStorage.getItem("mode")||""),localStorage.setItem("mode",o),document.body.classList.remove(...Object.values(e)),document.body.classList.add(o)}function i(){t()}export{i as init};
//# sourceMappingURL=index.js.map
