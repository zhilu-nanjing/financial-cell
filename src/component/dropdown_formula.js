import Dropdown from './dropdown';
import Icon from './icon';
import { h } from './element';
import { baseFormulas } from '../calc/calc_cmd/formula';
import { cssPrefix } from '../config';

export default class DropdownFormula extends Dropdown {
  constructor() {
    const nformulas = baseFormulas.map(it => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.hide();
        this.change(it);
      })
      .child(it.key));
    super(new Icon('cellFormulaProxy'), '180px', true, 'bottom-left', {type: false}, ...nformulas );
  }
}
