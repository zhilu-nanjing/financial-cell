import CellRange from "./cell_range";

export default class PasteProxy {
    constructor(srcCellRange, dstCellRange, rows) {
        this.srcCellRange = "";
        this.dstCellRange = "";
        this.srcOneDRange = "";
        this.dstOneDRange = "";
    }

    setSrcAndDstCellRange(srcCellRange, dstCellRange) {
        this.srcCellRange = srcCellRange;
        this.dstCellRange = dstCellRange;
    }

    use() {
        let {srcCellRange, dstCellRange} = this;
        const {
            sri, sci, eri, eci,
        } = srcCellRange;

        const dsri = dstCellRange.sri;
        const dsci = dstCellRange.sci;
        const deri = dstCellRange.eri;
        const deci = dstCellRange.eci;
        const [rn, cn] = srcCellRange.size();
        const [drn, dcn] = dstCellRange.size();

        return {
            sri, sci, eri, eci, dsri, dsci, deri, deci, rn, cn, drn, dcn
        }
    }

    autoFilterDirection() {
        let {sri, dsri, deri, eri} = this.use();

        let isLeftRight = false; // 识别方向  上下false、左右true
        if (sri == dsri && deri == eri) {
            isLeftRight = true;
        }

        return isLeftRight;
    }

    upOrDown() {
        let {deri, sri, deci, sci,} = this.use();
        let isDown = true;       // 往上是false, 往下是true     // isDown
        if (deri < sri || deci < sci) {
            isDown = false;
        }

        return isDown;
    }

    leftOrRight() {
        let {
            srcOneDRange,
            dstOneDRange
        } = this.getRangeByWay();

        let line = 1;       // 往左往右
        if (srcOneDRange.sri === srcOneDRange.eri && dstOneDRange.eci > srcOneDRange.eci) {
            line = 2;       // 往右
        } else if (srcOneDRange.sri === srcOneDRange.eri && dstOneDRange.eci < srcOneDRange.eci) {
            line = 3;       // 往左
        }
        return line;
    }

    getOneDRangeObj(way, offset) {
        let {sri, sci, eri, eci, dsri, dsci, deri, deci} = this.use();

        if (!way) {
            this.srcOneDRange = new CellRange(sri, sci + offset, eri, sci + offset);
            this.dstOneDRange = new CellRange(dsri, dsci + offset, deri, dsci + offset);
        } else {
            this.srcOneDRange = new CellRange(sri + offset, sci, sri + offset, eci);
            this.dstOneDRange = new CellRange(dsri + offset, dsci, dsri + offset, deci);
        }

        return this.getRangeByWay();
    }

    getRangeByWay() {
        return {
            "srcOneDRange": this.srcOneDRange,
            "dstOneDRange": this.dstOneDRange
        }
    }

    // todo 什么意思
    isCopy(sarr, i) {
        let {sri, sci, eri} = this.use();
        let isCopy = false;
        if (sarr.length > 1) {
            isCopy = true;
        }
        if (sri == eri && sci + i == sci + i) {
            isCopy = true;
        }

        return isCopy;
    }

    calcDiff(sarr, isAdd) {
        let diffValue = 1;

        if (!isAdd) {
            diffValue = 1;
        }

        if (isAdd && sarr.length > 1) {
            let last2 = sarr[sarr.length - 2];
            let last1 = sarr[sarr.length - 1];
            diffValue = last1.text * 1 - last2.text * 1;
        } else if (sarr.length > 1) {
            let last2 = sarr[1];
            let last1 = sarr[0];
            diffValue = last1.text * 1 - last2.text * 1;
        }

        if(isNaN(diffValue)) {
            diffValue = 1;
        }

        return diffValue;
    }
}