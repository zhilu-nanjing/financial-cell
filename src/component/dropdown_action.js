import Dropdown from "./dropdown";
import Icon from "./icon";
import HistoryBorder from "./history_border";

/**
 * 对应工具栏最左边的撤销恢复操作
 */
export default class DropdownAction extends Dropdown {
    constructor(iconName, change, arrowChange) {
        const icon = new Icon(iconName)
            .css('height', '18px');
        const historyBorder = new HistoryBorder();
        super(icon, 'auto', true, 'bottom-left', {type: true, change: change, arrowChange: arrowChange, historyBorder}, historyBorder.el);
    }
}
