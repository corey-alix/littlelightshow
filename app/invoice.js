export function init() {
  netlifyIdentity.on("init", (user) => console.log("init", user));
  netlifyIdentity.on("login", (user) => console.log("login", user));
  netlifyIdentity.on("logout", () => console.log("Logged out"));
  netlifyIdentity.on("error", (err) => console.error("Error", err));
  netlifyIdentity.on("open", () => console.log("Widget opened"));
  netlifyIdentity.on("close", () => console.log("Widget closed"));

  showInvoiceForm();

  netlifyIdentity.on("login", (user) => {
    if (user.app_metadata.provider === "google") {
      const userName = user.email;
      showInvoiceForm({ userName });
    }
  });

  function showInvoiceForm(auth) {
    const { userName } = auth || { userName: "" };
    document.querySelectorAll(".visible-when-auth").forEach((n) => {
      console.log(n);
      n.style.display = !!userName ? "block" : "none";
    });
    document.querySelectorAll(".visible-when-noauth").forEach((n) => {
      console.log(n);
      n.style.display = !userName ? "block" : "none";
    });
  }
}
