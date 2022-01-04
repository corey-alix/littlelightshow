import { getGlobalState } from "./globalState";

export const modes = {
  light_mode: "light",
  dark_mode: "dark",
  holiday_mode: "holiday",
};

export function setMode(mode?: string) {
  if (!mode)
    mode =
      localStorage.getItem("mode") ||
      modes.light_mode;

  localStorage.setItem("mode", mode);

  document.body.classList.remove(
    ...Object.values(modes)
  );

  document.body.classList.add(mode);

  const isFontier =
    true ==
    getGlobalState<boolean>("textier");
  document.body.classList.toggle(
    "textier",
    isFontier
  );
}
