import {
  hookupTriggers,
  stripAccessControlItems,
} from "../fun/hookupTriggers.js";
import {
  extendNumericInputBehaviors,
  extendTextInputBehaviors,
} from "../fun/behavior/form.js";

export async function prepareForm(
  formDom: HTMLElement
) {
  if (
    formDom.classList.contains(
      "prepared"
    )
  ) {
    alert("already prepared");
    return;
  }

  await stripAccessControlItems(
    formDom
  );
  hookupTriggers(formDom);
  extendNumericInputBehaviors(formDom);
  extendTextInputBehaviors(formDom);
  formDom.classList.add("prepared");
}
