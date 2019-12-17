import {sheetReset} from "../component/sheet";
import {h} from "../component/element";
import Drag from "../external/drag";
import Resize from "../external/resize";
import {cssPrefix} from "../config";
import {getChooseImg} from "../event/copy";
import CellRange from "../core/cell_range";
import TableProxy from "../core/table_proxy";

export let resizeOption = {
    onBegin(data) {
        console.log("obegin", data)
    },

    onEnd(data) {

    },
    onResize(data, self) {
        let img = getChooseImg.call(self);
        if (!img)
            return;

        img.img2.style['width'] = img.img.el.style['width'];
        img.img2.style['height'] = img.img.el.style['height'];
    }
};

export let dragOption = {
    onBegin(data) {
        console.log("obegin", data)
    },
    onEnd(data, self) {
        let {left, top} = data;
        let img = getChooseImg.call(self);
        if (!img)
            return;
        // img.left = left + 70;
        // img.top = top + 31;

        if (top - 31 < 0) {
            top = 0;
        } else if (left - 60 < 0) {
            left = 0;
        }

        let range = self.data.getCellRectByXY(left + 60, top + 31);
        range.sri = range.ri;
        range.sci = range.ci;
        range.eri = range.ri;
        range.eci = range.ci;
        let offsetLeft = left - range.left + 50;
        let offsetTop = top - range.top + 21;

        img.offsetLeft = offsetLeft;
        img.offsetTop = offsetTop;
        img.range = range;
        if (typeof img.lastCi !== 'undefined' && typeof img.lastRi !== 'undefined') {
            img.ri = img.lastRi;
            img.ci = img.lastCi;
        }
        img.lastCi = range.ci;
        img.lastRi = range.ri;

        // self.data.history.addPic(deepCopy(self.data.pasteDirectionsArr), "delete");
    },
    onDrag(data) {
    },
};

function spanDomPackage(spanDom, tableDom) {
    let table = h("table", "");
    let tbody = h('tbody', '');

    let textArr = spanDom.innerText.split("\n");
    for (let i = 0; i < textArr.length; i++) {
        let text = textArr[i];
        let tr = h('tr', '');
        let td = h('td', '');
        td.html(text);
        td.css('background', spanDom.style['background']);
        td.css('font-weight', spanDom.style['font-weight']);
        td.css('color', spanDom.style['color']);
        tr.child(td);
        tbody.child(tr);
    }

    table.child(tbody);
    tableDom = table.el;

    return tableDom;
}

export function process(tableDom, styleDom = "") {
    let {el, data} = this;
    // data.history.add(data.getData());
    el.child(tableDom);
    GetInfoFromTable.call(this, tableDom);
    tableDom.parentNode.removeChild(tableDom);
    if (styleDom) {
        styleDom.parentNode.removeChild(styleDom);
    }
    sheetReset.call(this);
}

function mountPaste(e, cb) {
    let cbd = e.clipboardData;
    let p = false;

    for (let i = 0; i < cbd.items.length; i++) {
        let item = cbd.items[i];
        if (item.kind === "string") {
            item.getAsString((str) => {
                let textDom = h('head', '');
                let d = h('span', '');
                if ((str.indexOf('<span') === -1 && str.indexOf('span>') === -1) && (str.indexOf('<table') === -1 && str.indexOf('table>') === -1)) {
                    d.html(str);
                    textDom.child(d.el);
                    textDom = textDom.el;
                }
                else {
                    textDom.html(str);
                    textDom = textDom.el;
                }
                let imgDom = textDom.getElementsByTagName("img")[0];
                let styleDom = textDom.getElementsByTagName("style")[0];
                let tableDom = textDom.getElementsByTagName("table")[0];
                let spanDom = textDom.getElementsByTagName("span")[0];
                if (imgDom && !styleDom) {
                    mountImg.call(this, imgDom);
                    p = true;
                } else {
                    if (!tableDom) {
                        setTimeout(() => {
                            if (p) {
                                return;
                            }
                            if (spanDom) {
                                tableDom = spanDomPackage.call(this, spanDom, tableDom);
                            }
                            if (styleDom) {
                                let {el} = this;
                                el.child(styleDom);
                            }

                            if (tableDom && p === false) {
                                let {el} = this;
                                el.child(tableDom);
                                GetInfoFromTable.call(this, tableDom);
                                tableDom.parentNode.removeChild(tableDom);
                                if (styleDom) {
                                    styleDom.parentNode.removeChild(styleDom);
                                }
                                sheetReset.call(this);
                                p = true;
                            }
                        }, 100)
                    } else {
                        if (styleDom) {
                            let {el} = this;
                            el.child(styleDom);
                        }

                        if (tableDom && p === false) {
                            process.call(this, tableDom, styleDom);
                            p = true;
                        }
                    }
                }
            });
        } else if (item.kind === "file" && !p) {
            let f = item.getAsFile();
            let reader = new FileReader();
            reader.onload = (evt) => {
                // let {x, y, overlayerEl} = this;
                // let {pasteDirectionsArr} = this.data;
                let img = h('img', 'paste-img');
                img.el.src = evt.target.result;

                setTimeout(() => {
                    if (p) {
                        return;
                    }
                    p = true;
                    mountImg.call(this, img.el);
                }, 0);
            };

            if (!f)
                return;
            reader.readAsDataURL(f);
        }
    }
    setTimeout(() => {
        if (!p)
            cb();
        else {
            let {data} = this;
            data.change(data.getData());
        }
    })
}

// function processImg(item) {
//     let f = item.getAsFile();
//     let reader = created FileReader();
//     reader.onload = (evt) => {
//         // let {x, y, overlayerEl, pasteDirectionsArr} = this;
//         let img = h('img', 'paste-img');
//         img.el.src = evt.target.result;
//
//         setTimeout(() => {
//             if (p) {
//                 return;
//             }
//             p = true;
//             mountImg.call(this, img.el);
//         }, 0);
//     };
//
//     reader.readAsDataURL(f);
// }

// function moveArr(top, left) {
//     let {pasteDirectionsArr} = this.data;
//     for (let i = 0; i < pasteDirectionsArr.length; i++) {
//         let p = pasteDirectionsArr[i];
//         console.log(p.img.el['style'].top, "108");
//         p.img.css("top", `${top }px`)
//             .css("left", `${left  }px`)
//     }
// }

function getMaxCoord(ri, ci) {
    let top = 0;
    let left = 0;
    let {pasteDirectionsArr} = this.data;
    let number = 0;
    for (let i = 0; i < pasteDirectionsArr.length; i++) {
        let p = pasteDirectionsArr[i];
        if (p.ri === ri && p.ci === ci) {
            if (left < p.nextLeft) {
                left = p.nextLeft;
            }
            if (top < p.nextTop) {
                top = p.nextTop;
            }
            number++;
        }
    }

    return {
        top: top,
        left: left,
        number: number,
    }
}


// 删掉了 入参   add = true
export function mountImg(imgDom, init = false, sri, sci, range) {
    let image = new Image();
    image.src = imgDom.src;
    image.onload = () => {
        let width = image.width;
        let height = image.height;
        let img = imgDom;
        let {container, data} = this;
        let {pasteDirectionsArr} = data;
        // if (add) {
        //     // data.history.addPic(Object.assign([], pasteDirectionsArr), "delete");
        // }

        let {ri, ci} = data.selector;
        if (init) {
            ri = sri;
            ci = sci;
        }
        let {pictureOffsetLeft, pictureOffsetTop} = this;

        const rect = data.getMoveRect(new CellRange(ri, ci, ri, ci));
        let left = rect.left + pictureOffsetLeft;
        let top = rect.top + pictureOffsetTop;
        let number = 0;
        let choose = getChooseImg.call(this);
        if (choose) {
            let args = getMaxCoord.call(this, choose.ri, choose.ci);
            left = args.left;
            top = args.top;
            ri = choose.ri;
            ci = choose.ci;
            number = args.number;
        }

        let div = h('div', `${cssPrefix}-object-container`)
            .css("position", "absolute")
            .css("top", `${top}px`)
            .css("width", `${width}px`)
            .css("height", `${height}px`)
            .css("z-index", `100000`)
            .css("left", `${left}px`)
            .child(img);
        container.child(div);
        new Drag(dragOption, this).register(div.el);
        setTimeout(() => {
            let {data} = this;
            let directionsArr = new Resize(resizeOption, this).register(div.el);
            let index = pasteDirectionsArr.length;

            pasteDirectionsArr.push({
                "src": img.src,
                "state": true,
                "arr": directionsArr,
                "img": div,
                "index": index,
                "img2": img,
                "ri": ri,
                "ci": ci,
                "offsetLeft": 0,
                "offsetTop": 0,
                "number": number,
                "range": init ? range : data.selector.range,
                "top": top,
                "left": left,
                "nextLeft": left + 15,
                "nextTop": top + 15,
            });
            if (!init) {
                this.data.change(this.data.getData());
            }
            this.direction = true;
            div.css("width", `${img.offsetWidth}px`);
            div.css("height", `${img.offsetHeight}px`);
            containerHandlerEvent.call(this, directionsArr, index, pasteDirectionsArr, init);
            div.on('mousedown', () => containerHandlerEvent.call(this, directionsArr, index, pasteDirectionsArr));
        }, 0);
    };
}

function hideDirectionArr() {
    let {pasteDirectionsArr} = this.data;
    this.direction = false;
    if (pasteDirectionsArr.length > 0) {
        for (let i = 0; i < pasteDirectionsArr.length; i++) {
            let arr = pasteDirectionsArr[i].arr;
            if (arr.length > 0) {
                for (let j = 0; j < arr.length; j++) {
                    arr[j].style.display = 'none';
                }
            }
            pasteDirectionsArr[i].state = false;
            pasteDirectionsArr[i].img.css("z-index", "10000");
            pasteDirectionsArr[i].img2.style['border'] = "none";
        }
    }
}

function deleteImg(d = false) {
    let {pasteDirectionsArr} = this.data;
    let direction_new = [];
    let direction_delete = [];
    this.direction = false;
    if (pasteDirectionsArr.length > 0) {
        for (let i = 0; i < pasteDirectionsArr.length; i++) {
            if (pasteDirectionsArr[i].state === true || d === true) {
                direction_delete.push(pasteDirectionsArr[i]);
            } else {
                direction_new.push(pasteDirectionsArr[i]);
            }
        }
    }

    Object.keys(direction_delete).forEach(i => {
        direction_delete[i].img.removeEl();
    });

    this.pasteDirectionsArr = direction_new;

    let {data} = this;
    data.pasteDirectionsArr = direction_new;
    data.change(data.getData());
}

// function deleteAllImg() {
//     let {pasteDirectionsArr} = this.data;
//     let direction_new = [];
//     let direction_delete = [];
//     this.direction = false;
//     if (pasteDirectionsArr.length > 0) {
//         for (let i = 0; i < pasteDirectionsArr.length; i++) {
//             direction_delete.push(pasteDirectionsArr[i]);
//         }
//     }
//
//     Object.keys(pasteDirectionsArr).forEach(i => {
//         direction_delete[i].img.removeEl();
//     });
//
//     this.pasteDirectionsArr = direction_new;
// }

function containerHandlerEvent(directionsArr, index, pasteDirectionsArr, init) {
    hideDirectionArr.call(this);
    this.direction = true;
    Object.keys(directionsArr).forEach(i => {
        directionsArr[i].style.display = 'block';
    });

    let {selector, editor} = this;
    if (!init) {
        selector.hide();
        editor.clear();

        pasteDirectionsArr[index].img.css("z-index", "99999999");
        pasteDirectionsArr[index].state = true;
    } else {
        hideDirectionArr.call(this);
    }
}

function equals(x, y) {
    let f1 = x instanceof Object;
    let f2 = y instanceof Object;
    if (!f1 || !f2) {
        return x === y
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
        return false
    }
    let newX = Object.keys(x);
    for (let p in newX) {
        p = newX[p];
        let a = x[p] instanceof Object;
        let b = y[p] instanceof Object;
        if (a && b) {
            let equal = equals(x[p], y[p]);
            if (!equal) {
                return equal
            }
        } else if (x[p] !== y[p]) {
            return false;
        }
    }
    return true;
}

export function isHaveStyle(styles, style) {
    for (let i = 0; i < styles.length; i++) {
        if (equals(styles[i], style)) {
            return i;
        }
    }
    return -1;
}


function GetInfoFromTable(tableObj) { // class ClipboardTableProxy; .tableDom 属性  .dealColSpan() [477~483], dealStyle(), dealReferrence()， 最终得到row2； sheet层面上：（1）增加行与列。（2）setCellRange变更值。（3）给出黏贴选项
    let {data} = this;
    let {ri, ci} = data.selector;
    let styles = data.styles;
    console.time("paste");
    let tableProxy = new TableProxy(data);

    tableProxy.extend(tableObj, {ri, ci});
    tableProxy.dealColSpan(tableObj);
    tableProxy.dealStyle(tableObj, {ri, ci});
    let {reference} = tableProxy.dealReference(tableObj, {ri, ci});
    this.setCellRange(reference, tableProxy, true, tableProxy.parseTableCellRange(tableObj, {ri, ci}));

    const rect = data.getSelectedRect();
    let left = rect.left + rect.width + 60;
    let top = rect.top + rect.height + 31;
    let {advice, editor} = this;
    editor.clear();
    advice.show(left, top, 1, reference, tableProxy);
    console.timeEnd("paste");
    return {
        rows: data.rows._,
        styles: styles
    };
}

// function pasteType(type, ds, dei) {
//     if (type === 1) {
//
//     } else if (type === 2) {
//         xy2expr(ds[0] + dei, ds[1], 2);
//     }
// }

export {
    mountPaste,
    hideDirectionArr,
    deleteImg,
    // moveArr,
    // deleteAllImg,
    GetInfoFromTable,
}

