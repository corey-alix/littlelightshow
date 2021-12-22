const DEFAULT_DELAY = 5000;

class Toaster {
  toast(options: { message: string }) {
    let target =
      document.querySelector(
        "#toaster"
      );
    if (!target) {
      target =
        document.createElement("div");
      target.classList.add(
        "toaster",
        "border",
        "rounded",
        "bottom",
        "right"
      );
      document.body.appendChild(target);
    }

    const message =
      document.createElement("div");
    message.classList.add(
      "error",
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

const toaster = new Toaster();

export function toast(message: string) {
  toaster.toast({ message });
}
