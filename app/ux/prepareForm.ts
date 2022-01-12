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
  await stripAccessControlItems(
    formDom
  );
  hookupTriggers(formDom);
  extendNumericInputBehaviors(formDom);
  extendTextInputBehaviors(formDom);
}
