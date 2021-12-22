export const modes = {
  light_mode: "light",
  dark_mode: "dark",
  holiday_mode: "holiday",
};

export function setMode(mode?: string) {
  if (!mode)
    mode =
      localStorage.getItem("mode") ||
      "holiday";
  localStorage.setItem("mode", mode);

  document.body.classList.remove(
    ...Object.values(modes)
  );

  document.body.classList.add(mode);
}

setMode(
  localStorage.getItem("mode") ||
    modes.holiday_mode
);
