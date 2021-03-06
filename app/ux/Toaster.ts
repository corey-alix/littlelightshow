const DEFAULT_DELAY = 5000;

export class Toaster {
  toast(options: {
    message: string;
    mode: string;
  }) {
    let target =
      document.querySelector(
        "#toaster"
      );
    if (!target) {
      target =
        document.createElement("div");
      target.id = "toaster";
      target.classList.add(
        "toaster",
        "rounded-top",
        "fixed",
        "bottom",
        "right"
      );
      document.body.appendChild(target);
    }

    const message =
      document.createElement("div");
    message.classList.add(
      options.mode || "error",
      "padding",
      "margin"
    );
    message.innerHTML = options.message;
    message.addEventListener(
      "click",
      () => message.remove()
    );
    setTimeout(
      () => message.remove(),
      DEFAULT_DELAY
    );

    target.insertBefore(message, null);
  }
}
