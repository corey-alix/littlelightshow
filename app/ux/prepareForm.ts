import {
  hookupTriggers,
  stripAccessControlItems,
} from "../fun/hookupTriggers.js";
import {
  extendNumericInputBehaviors,
  extendTextInputBehaviors,
} from "../fun/behavior/form.js";
import { injectLabels } from "./injectLabels.js";

export async function prepareForm(
  formDom: HTMLElement
) {
  if (
    formDom.classList.contains(
      "prepared"
    )
  ) {
    throw "already prepared";
  }

  await stripAccessControlItems(
    formDom
  );
  injectLabels(formDom);
  hookupTriggers(formDom);
  extendNumericInputBehaviors(formDom);
  extendTextInputBehaviors(formDom);
  formDom.classList.add("prepared");
}
