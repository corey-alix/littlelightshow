// app/globals.ts
var accessKeys = {
  FAUNADB_SERVER_SECRET: "",
  FAUNADB_ADMIN_SECRET: "",
  FAUNADB_DOMAIN: "db.us.fauna.com"
};
var _a;
if ((_a = globalThis.process) == null ? void 0 : _a.env) {
  accessKeys.FAUNADB_SERVER_SECRET = process.env.FAUNADB_SERVER_SECRET;
  accessKeys.FAUNADB_ADMIN_SECRET = process.env.FAUNADB_ADMIN_SECRET;
} else if (localStorage) {
  accessKeys.FAUNADB_SERVER_SECRET = localStorage.getItem("FAUNADB_SERVER_SECRET");
  accessKeys.FAUNADB_ADMIN_SECRET = localStorage.getItem("FAUNADB_ADMIN_SECRET");
  if (!accessKeys.FAUNADB_SERVER_SECRET)
    throw "set FAUNADB_SERVER_SECRET in local storage";
  if (!accessKeys.FAUNADB_ADMIN_SECRET)
    throw "set FAUNADB_ADMIN_SECRET in local storage";
}
function isNetlifyBuildContext() {
  var _a2;
  return !!((_a2 = globalThis.process) == null ? void 0 : _a2.env.DEPLOY_PRIME_URL);
}
var domain = accessKeys.FAUNADB_DOMAIN;
var FAUNADB_SERVER_SECRET = accessKeys.FAUNADB_SERVER_SECRET;
var FAUNADB_ADMIN_SECRET = accessKeys.FAUNADB_ADMIN_SECRET;
var CONTEXT = isNetlifyBuildContext() ? "NETLIFY" : "dev";

// app/invoice.ts
var EventBus = class {
  constructor() {
    this.handlers = {};
  }
  on(eventName, cb) {
    if (!this.handlers[eventName])
      this.handlers[eventName] = [];
    this.handlers[eventName].push(cb);
    return {
      off: () => {
        const i = this.handlers[eventName].indexOf(cb);
        if (i >= 0)
          this.handlers[eventName].splice(i, 1);
      }
    };
  }
  trigger(eventName) {
    if (!this.handlers[eventName])
      return;
    this.handlers[eventName].forEach((cb) => cb());
  }
  destroy() {
    this.handlers = {};
  }
};
function domAsForm(dom) {
  if (!dom)
    throw "cannot create a form without a dom element";
  const channel = new EventBus();
  dom.querySelectorAll("[data-event]").forEach((eventItem) => {
    eventItem.addEventListener("click", () => {
      const eventName = eventItem.dataset["event"];
      if (!eventName)
        throw "item must define a data-event";
      channel.trigger(eventName);
    });
  });
  return channel;
}
function asForm(fieldInfos) {
  const fieldNames = Object.keys(fieldInfos);
  const form = document.createElement("form");
  fieldNames.forEach((fieldName) => {
    const fieldInfo = fieldInfos[fieldName];
    const label = document.createElement("label");
    label.innerText = fieldInfo.label || fieldName;
    const input = document.createElement("input");
    if (fieldInfo.readonly)
      input.readOnly = true;
    if (fieldInfo.required)
      input.required = true;
    label.appendChild(input);
    input.id = fieldName;
    input.classList.add("field", fieldName, fieldInfo.type || "text");
    switch (fieldInfo.type) {
      case "currency":
        input.type = "number";
        label.classList.add("align-right");
        input.setAttribute("step", "0.01");
        break;
      case "quantity":
        input.type = "number";
        label.classList.add("align-right");
        break;
      default:
        label.classList.add("align-left");
    }
    if (fieldInfo.value) {
      const fieldValue = fieldInfo.value;
      if (typeof fieldValue == "boolean")
        input.checked = fieldValue;
      else if (typeof fieldValue == "number")
        input.valueAsNumber = fieldValue;
      else
        input.value = fieldValue;
    }
    form.appendChild(label);
  });
  return form;
}
function bind(form, querySelectors, cb) {
  const inputs = querySelectors.map((qs) => form.querySelector(qs));
  const callback = () => cb(inputs);
  inputs.forEach((input) => input.addEventListener("change", callback));
}
function createItemPanel() {
  const form = asForm({
    item: { label: "Item", required: true },
    quantity: { label: "Quantity", type: "quantity", required: true, value: 1 },
    price: { label: "Price", type: "currency", required: true },
    total: { label: "Total", type: "currency", readonly: true }
  });
  const totalInput = form.querySelector("#total");
  bind(form, ["#price", "#quantity"], ([price, quantity]) => {
    totalInput.valueAsNumber = price.valueAsNumber * quantity.valueAsNumber;
  });
  return form;
}
function showInvoiceForm(auth) {
  const { userName } = auth || { userName: "" };
  document.querySelectorAll(".visible-when-auth").forEach((n) => {
    n.style.display = !!userName ? "block" : "none";
  });
  document.querySelectorAll(".visible-when-noauth").forEach((n) => {
    n.style.display = !userName ? "block" : "none";
  });
  const formDom = document.querySelector("#invoice-form");
  if (!formDom)
    throw "a form must be defined with id of 'invoice-form'";
  const form = domAsForm(formDom);
  form.on("add-another-item", () => {
    addAnotherItem(formDom);
  });
  addAnotherItem(formDom);
}
function addAnotherItem(formDom) {
  const itemPanel = createItemPanel();
  const target = formDom.querySelector(".line-items") || formDom;
  while (itemPanel.firstChild) {
    target.appendChild(itemPanel.firstChild);
  }
}
function init() {
  switch (CONTEXT) {
    case "dev":
      showInvoiceForm({ userName: "dev" });
      break;
    case "NETLIFY":
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
      break;
  }
}
export {
  init
};
