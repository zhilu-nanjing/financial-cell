import Dropdown from './dropdown';
import Icon from './icon';
import { h } from './element';
// import { allFnObj } from '../calc/calc_cmd/formula';
import { allFnObj } from '../calc/calc_cmd/mock_calc';

import { cssPrefix } from '../config';

export default class DropdownFormula extends Dropdown {
  constructor() {
    const nformulas = allFnObj.map(it => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.hide();
        this.change(it);
      })
      .child(it.key));
    super(new Icon('cellFormulaProxy'), '180px', true, 'bottom-left', {type: false}, ...nformulas );
  }
}
