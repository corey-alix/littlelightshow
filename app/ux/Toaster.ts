const DEFAULT_DELAY = 5000;

class Toaster {
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
        "border",
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

const toaster = new Toaster();

export function toast(
  message: string,
  options?: { mode: string }
) {
  if (!options)
    options = { mode: "info" };
  console.info(message, options);
  toaster.toast({
    message,
    ...options,
  });
}

export function reportError(
  message: any
) {
  toast(message + "", {
    mode: "error",
  });
}
