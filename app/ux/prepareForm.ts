import {
  hookupTriggers,
  stripAccessControlItems,
} from "../fun/hookupTriggers.js";
import {
  extendNumericInputBehaviors,
  extendTextInputBehaviors,
} from "../fun/behavior/form.js";

export function prepareForm(
  formDom: HTMLElement
) {
  stripAccessControlItems(formDom);
  hookupTriggers(formDom);
  extendNumericInputBehaviors(formDom);
  extendTextInputBehaviors(formDom);
}
