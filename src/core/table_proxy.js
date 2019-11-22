import {isHaveStyle} from "../event/paste";
import {Rows} from "../core/row";
import {splitStr} from "../core/operator";
// import {xy2expr} from "../core/alphabet";
import CellRange from '../core/cell_range';
import {isHave} from "../core/helper";
// jobs: todo: 为什么TableProxy放在event文件夹里面，似乎应该放到core文件夹？
export default class TableProxy {
    constructor(data ) {
        this.data = data;
         this.rows = new Rows({len: 0, height: 0}, data);
    }

    getComputedStyle(computedStyle) {
        let bold = false;
        if (computedStyle.fontWeight > 400) {
            bold = true;
        }

        return {
            color: computedStyle.color,
            bgcolor: computedStyle.background.substring(0,
                computedStyle.background.indexOf(")") + 1),
            font: {
                bold: bold,
            },
        };
    }

    extend(tableDom, {ri, ci}) {
        let {data} = this;
        if (tableDom.rows.length >= data.rows.len - ri) {
            let diff = tableDom.rows.length - (data.rows.len - ri);
            if(diff > 0) {
                data.insert('row', diff);
            }
        }

        if (isHave(tableDom.rows[0]) === false || isHave(tableDom.rows[0].cells) === false) {
            return;
        }

        let colLen = tableDom.rows[0].cells.length;
        if (colLen >= data.cols.len) {
            let diff = colLen - (data.cols.len - ci);
            if(diff > 0) {
                data.insert('column', diff, data.cols.len);
            }
        }
    }

    each(obj, cb) {
        for (let i = 0; i < obj.rows.length; i++) {
            for (let j = 0; j < obj.rows[i].cells.length; j++) {
                cb(i, j, obj.rows[i].cells[j]);
            }
        }
    }

    dealColSpan(tableDom) {
        this.each(tableDom, (i, j, cell) => {
            let len = cell.getAttribute("colspan");
            if (len && len > 1) {
                for (let c = 0; c < len - 1; c++) {
                    tableDom.rows[i].insertBefore(document.createElement("td"), tableDom.rows[i].cells[j + 1]);
                }
            }
        });
    }

    dealStyle(tableDom, {ri, ci}) {
        let {data, rows} = this;
        let styles = data.styles;

        this.each(tableDom, (i, j, cell) => {
            let computedStyle = document.defaultView.getComputedStyle(cell, false);
            let args = this.getComputedStyle(computedStyle);
            let index = isHaveStyle(styles, args);
            if (index === -1) {
                styles.push(args);
            }
            rows.setCell(ri + i, ci + j, {"style": index === -1 ? styles.length - 1 : index}, 'all');
        });
    }

    parseTableCellRange(tableDom, {ri, ci}) {
      let maxRi = ri, maxCi = ci;
      this.each(tableDom, (i, j) => {
        let rii = ri + i;
        let cij = ci + j;
            if(maxRi < rii) {
              maxRi = rii;
            }
            if(maxCi < cij) {
              maxCi = cij;
            }
        });
        return new CellRange(ri, ci, maxRi, maxCi);
    }

    dealReference(tableDom, {ri, ci}) {
        let {rows} = this;
         let reference = [];

        this.each(tableDom, (i, j, cell) => { // 处理reference函数提取一下，填充也用引用这个函数。 updateCEllReferenceByShift， 跟填充的逻辑共享
            let node = cell.querySelector("reference");
            let innerText = cell.innerText || "";
            if (node) {
                let eri = node.getAttribute('ri');
                let eci = node.getAttribute('ci');

                let strList = splitStr(innerText);
                let dci = i + ri - eri;
                let dei = j + ci - eci;

                let {bad, result} = rows.getCellTextByShift(strList, dei, dci);
                rows.updateCellReferenceByShift(bad, result, ri + i, ci + j);
            } else {
                let _cell = rows.getCell(ri + i, ci + j) || {};
                _cell.text = innerText;
                _cell.formulas = innerText;

                rows.setCell(ri + i, ci + j, _cell, 'all');
            }
            // proxy.setCell(data.name, xy2expr(ci + j, ri + i));

            reference.push({
                ri: ri + i,
                ci: ci + j
            });
        });
        return {"reference": reference};
    }
}
