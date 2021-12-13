interface Dictionary<T> {
  [index: string]: T;
}

function asStyle(o: any) {
  if (typeof o === "string") return o;
  return Object.keys(o)
    .map((k) => `${k}:${o[k]}`)
    .join(";");
}

/**
 * shallow copies b into a, preserving any existing values in a
 * @param a target
 * @param b values to copy into target if they are not already present
 */
function defaults<A>(a: A, ...b: Partial<A>[]): A {
  b.filter((b) => !!b).forEach((b) => {
    Object.keys(b)
      .filter((k) => (<any>a)[k] === undefined)
      .forEach((k) => ((<any>a)[k] = (<any>b)[k]));
  });
  return a;
}

const rules: Dictionary<(v: any) => string> = {
  style: asStyle,
};

const default_args = {
  button: {
    type: "button",
  },
};

type Args = Dictionary<string | Function | Dictionary<string>>;
type ChildTypes = HTMLElement | string;
type ChildrenCollection = [ChildTypes | Array<ChildTypes>][];
type Widget = { setContent: Function; addChild: Function };
type WidgetFactory = (args: Args) => Widget;

/**
 * This is a react.CreateElement implementation
 * import dom as the value in the tsconfig.json "jsxFactory"
 * @param tag
 * @param args
 * @param children
 */
export function dom(
  tag: string,
  args?: Args,
  ...children: ChildrenCollection
): HTMLElement;
export function dom(
  tag: string | WidgetFactory,
  args?: Args,
  ...children: ChildrenCollection
): HTMLElement | string | Widget;
export function dom(
  tag: string | WidgetFactory,
  args?: Args,
  ...children: ChildrenCollection
): HTMLElement | string | Widget {
  if (typeof tag === "string") {
    let element = document.createElement(tag);
    if (default_args[tag]) {
      args = defaults(args ?? {}, default_args[tag]);
    }
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = rules[key] ? rules[key](args![key]) : args![key];
        if (typeof value === "string") {
          //if (key === "class") key = "className";
          element.setAttribute(key, value);
        } else if (value instanceof Function) {
          element.addEventListener(<any>key, <any>value);
        } else {
          element.setAttribute(key, value + "");
        }
      });
    }

    let addChildren = (children: ChildrenCollection) => {
      children &&
        children.forEach((c) => {
          if (typeof c === "string") {
            element.appendChild(document.createTextNode(c));
          } else if (c instanceof HTMLElement) {
            element.appendChild(c);
          } else if (c instanceof Array) {
            addChildren(<ChildrenCollection>(<unknown>c));
          } else {
            console.log("addChildren cannot add to dom node", c);
          }
        });
    };

    children && addChildren(children);

    return element;
  }

  {
    let element = tag(args!);

    let addChildren = (children: ChildrenCollection) => {
      children &&
        children.forEach((c) => {
          if (typeof c === "string" || c instanceof HTMLElement) {
            element.setContent(c);
          } else if (c instanceof Array) {
            addChildren(<ChildrenCollection>(<unknown>c));
          } else if (typeof c === "object") {
            element.addChild(c);
          } else {
            console.log("addChildren cannot add to widget", c);
          }
        });
    };

    children && addChildren(children);
    return element;
  }
}
