import {h} from "../component/element";
import {cutStr} from "../core/operator";

function mountCopy(event) {
    event.preventDefault();
    let choose = getChooseImg.call(this);
    if (choose) {
        if (event.clipboardData) {
            event.clipboardData.setData("text/html", parseDom(choose.img2));
            event.clipboardData.setData("text/plain", "");
        }
        return;
    }

    let args = sheetCopy.call(this);
    if (event.clipboardData) {
        event.clipboardData.setData("text/html", parseDom(args.html.el));
        event.clipboardData.setData("text/plain", args.plain);
    }
}

function getChooseImg() {
    let {pasteDirectionsArr} = this.data;

    this.direction = false;
    if (pasteDirectionsArr.length > 0) {
        for (let i = 0; i < pasteDirectionsArr.length; i++) {
            if (pasteDirectionsArr[i].state === true) {
                this.container.css('pointer-events', 'auto');
                return pasteDirectionsArr[i];
            }
        }
    }
    return null;
}

function sheetCopy() {
    let args = {
        plain: "",
        html: h("table", ""),
    };

    let {selector, rows, styles} = this.data;
    let {sri, eri, sci, eci} = selector.range;
    let tbody = h('tbody', '');
    for (let i = sri; i <= eri; i += 1) {
        let tr = h('tr', '');
        for (let j = sci; j <= eci; j += 1) {
            let td = h('td', '');
            if (rows._[i] && rows._[i].cells && rows._[i].cells[j]) {
                if (rows._[i].cells[j] && styles[rows._[i].cells[j].style]) {
                    td.css('color', styles[rows._[i].cells[j].style].color);
                    if (styles[rows._[i].cells[j].style]
                        && styles[rows._[i].cells[j].style].font
                        && styles[rows._[i].cells[j].style].font.bold) {
                        let bold = styles[rows._[i].cells[j].style].font.bold ? '900' : '';
                        td.css('font-weight', bold);
                    }
                    td.css('background', styles[rows._[i].cells[j].style].bgcolor);
                }

                if(!rows._[i].cells[j].text) {
                    rows._[i].cells[j].text = "";
                }
                if(!rows._[i].cells[j].formulas) {
                    rows._[i].cells[j].formulas = "";
                }

                let text = rows._[i].cells[j].formulas !== "" ? rows._[i].cells[j].formulas : rows._[i].cells[j].text;
                if(rows._[i].cells[j].formulas && cutStr(rows._[i].cells[j].formulas, false, true).length > 0) {
                    let hidden = h('reference', '');
                    hidden.html(text);
                    hidden.attr('ri', i);
                    hidden.attr('ci', j);
                    td.child(hidden.el);
                } else
                    td.html(text);
                args.plain += text;
                args.plain += "\t";
            } else {
                args.plain += "\t";
            }
            tr.child(td);
        }

        tbody.child(tr);
        args.plain += "\n";
    }
    args.html.child(tbody);

    return args;
}

function parseDom(node) {
    let tmpNode = document.createElement("div");
    tmpNode.appendChild(node.cloneNode(true));

    return  tmpNode.innerHTML;
}

export {
    mountCopy,
    getChooseImg,
    sheetCopy
}