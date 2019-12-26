import {expr2xy, xy2expr} from '../utils/alphabet';

export default class CellRange {
    constructor(sri, sci, eri, eci, w = 0, h = 0) {
        this.sri = sri;
        this.sci = sci;
        this.eri = eri;
        this.eci = eci;
        this.w = w;
        this.h = h;
    }

    set(sri, sci, eri, eci) {
        this.sri = sri;
        this.sci = sci;
        this.eri = eri;
        this.eci = eci;
    }

    multiple() {
        return this.eri - this.sri > 0 || this.eci - this.sci > 0;
    }

    // cell-index: ri, ci
    // cell-ref: A10
    includes(...args) {
        let [ri, ci] = [0, 0];
        if (args.length === 1) {
            [ci, ri] = expr2xy(args[0]);
        } else if (args.length === 2) {
            [ri, ci] = args;
        }
        const {
            sri, sci, eri, eci,
        } = this;
        return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
    }

    each(cb, rowFilter = () => true) {
        const {
            sri, sci, eri, eci,
        } = this;
        for (let i = sri; i <= eri; i += 1) {
            if (rowFilter(i)) {
                for (let j = sci; j <= eci; j += 1) {
                    cb(i, j);
                }
            }
        }
    }

    // 1 * n  /  n * 1 / n * n
    getType() {
        let {
            sri, sci, eri, eci,
        } = this;

        if (sri === eri && sci !== eci) {
            return 1;
        } else if (sri !== eri && sci === eci) {
            return 2;
        } else if (sri !== eri && sci !== eci) {
            return 3;
        } else if (sri === eri && sci === eci) {
            return 1;
        }

        console.error("未知情况");
        return 4;
    }

    // each2(cb, rowFilter = () => true) {
    //     let {
    //         sri, sci, eri, eci,
    //     } = this;
    //     let extraRiValue = eri;
    //     let extraCiValue = eci;
    //
    //     if (sri - extraRiValue <= 0) {
    //         sri = 0;
    //     } else {
    //         sri = sri - extraRiValue;
    //     }
    //
    //     if (sci - extraCiValue <= 0) {
    //         sci = 0;
    //     } else {
    //         sci = sci - extraCiValue;
    //     }
    //
    //     for (let i = sri; i <= eri + extraRiValue; i += 1) {
    //         if (rowFilter(i)) {
    //             for (let j = sci; j <= eci + extraCiValue; j += 1) {
    //                 cb(i, j, eri, eci);
    //             }
    //         }
    //     }
    // }

    // eachGivenRange(cb, mri, mci) {
    //     let sri = 0;
    //     let sci = 0;
    //     let eri = mri;
    //     let eci = mci;
    //
    //     for (let i = sri; i <= eri; i += 1) {
    //         for (let j = sci; j <= eci; j += 1) {
    //             cb(i, j, eri, eci);
    //         }
    //     }
    // }

    move(ri, ci) {
        let d = this.eri - this.sri;        // 格子的长 单位 格
        let d2 = this.eci - this.sci;            // 格子的 宽 单位格
        this.sri = ri;
        this.sci = ci;
        this.eri = this.sri + d;
        this.eci = this.sci + d2;
    }

    move2(ri, ci, eri, eci) {
        this.sri = ri;
        this.sci = ci;
        this.eri = eri;
        this.eci = eci;
    }

    contains(other) {
        return this.sri <= other.sri
            && this.sci <= other.sci
            && this.eri >= other.eri
            && this.eci >= other.eci;
    }

    // within
    within(other) {
        return this.sri >= other.sri
            && this.sci >= other.sci
            && this.eri <= other.eri
            && this.eci <= other.eci;
    }

    // disjoint
    disjoint(other) {
        return this.sri > other.eri
            || this.sci > other.eci
            || other.sri > this.eri
            || other.sci > this.eci;
    }

    // intersects
    intersects(other) {
        return this.sri <= other.eri
            && this.sci <= other.eci
            && other.sri <= this.eri
            && other.sci <= this.eci;
    }

    getMovePos(ri, ci) {
        let {sri, sci, eri, eci} = this;

        let pos = 0;
        if (ri > eri && ci > eci) {
            pos = 1;        // 往下往右
        } else if (ri > eri && ci < sci) {
            pos = 7;        // 往下往左
        } else if (ri < sri && ci > eci) {
            pos = 8;        // 往上往右
        } else if (ci < sci && ri < sri) {
            pos = 4;        // 往上往左
        } else if (ri > eri) {
            pos = 2;        // 往下
        } else if (ci > eci) {
            pos = 3;        // 往右
        } else if (ci < sci) {
            pos = 5;        // 往左
        } else if (ri < sri) {
            pos = 6;        // 往上
        }

        return pos;
    }

    // union
    union(other) {
        const {
            sri, sci, eri, eci,
        } = this;
        return new CellRange(
            other.sri < sri ? other.sri : sri,
            other.sci < sci ? other.sci : sci,
            other.eri > eri ? other.eri : eri,
            other.eci > eci ? other.eci : eci,
        );
    }

    // intersection
    // intersection(other) {}

    // Returns Array<CellRange> that represents that part of this that does not intersect with other
    // difference
    difference(other) {
        const ret = [];
        const addRet = (sri, sci, eri, eci) => {
            ret.push(new CellRange(sri, sci, eri, eci));
        };
        const {
            sri, sci, eri, eci,
        } = this;
        const dsr = other.sri - sri;
        const dsc = other.sci - sci;
        const der = eri - other.eri;
        const dec = eci - other.eci;
        if (dsr > 0) {
            addRet(sri, sci, other.sri - 1, eci);
            if (der > 0) {
                addRet(other.eri + 1, sci, eri, eci);
                if (dsc > 0) {
                    addRet(other.sri, sci, other.eri, other.sci - 1);
                }
                if (dec > 0) {
                    addRet(other.sri, other.eci + 1, other.eri, eci);
                }
            } else {
                if (dsc > 0) {
                    addRet(other.sri, sci, eri, other.sci - 1);
                }
                if (dec > 0) {
                    addRet(other.sri, other.eci + 1, eri, eci);
                }
            }
        } else if (der > 0) {
            addRet(other.eri + 1, sci, eri, eci);
            if (dsc > 0) {
                addRet(sri, sci, other.eri, other.sci - 1);
            }
            if (dec > 0) {
                addRet(sri, other.eci + 1, other.eri, eci);
            }
        }
        if (dsc > 0) {
            addRet(sri, sci, eri, other.sci - 1);
            if (dec > 0) {
                addRet(sri, other.eri + 1, eri, eci);
                if (dsr > 0) {
                    addRet(sri, other.sci, other.sri - 1, other.eci);
                }
                if (der > 0) {
                    addRet(other.sri + 1, other.sci, eri, other.eci);
                }
            } else {
                if (dsr > 0) {
                    addRet(sri, other.sci, other.sri - 1, eci);
                }
                if (der > 0) {
                    addRet(other.sri + 1, other.sci, eri, eci);
                }
            }
        } else if (dec > 0) {
            addRet(eri, other.eci + 1, eri, eci);
            if (dsr > 0) {
                addRet(sri, sci, other.sri - 1, other.eci);
            }
            if (der > 0) {
                addRet(other.eri + 1, sci, eri, other.eci);
            }
        }
        return ret;
    }

    size() {
        return [
            this.eri - this.sri + 1,
            this.eci - this.sci + 1,
        ];
    }

    toString() {
        const {
            sri, sci, eri, eci,
        } = this;
        let ref = xy2expr(sci, sri);
        if (this.multiple()) {
            ref = `${ref}:${xy2expr(eci, eri)}`;
        }
        return ref;
    }

    includeByRiCi(ri, ci) {
        const {
            sri, sci, eri, eci,
        } = this;

        return sri <= ri && eri >= ri && sci <= ci && eci >= ci;
    }

    clone() {
        const {
            sri, sci, eri, eci, w, h,
        } = this;
        return new CellRange(sri, sci, eri, eci, w, h);
    }

    getLocationArray(sarr) {
        let darr = [];
        let index = 0;
        this.each((i, j) => {
            darr.push({ri: i, ci: j, v: sarr[index % sarr.length].tmp, type: sarr[index % sarr.length].type});
            index = index + 1;
        });

        return darr;
    }

    /*
    toJSON() {
      return this.toString();
    }
    */

    equals(other) {
        return this.eri === other.eri
            && this.eci === other.eci
            && this.sri === other.sri
            && this.sci === other.sci;
    }

    static valueOf(ref) {
        // B1:B8, B1 => 1 x 1 cell range
        const refs = ref.split(':');
        const [sci, sri] = expr2xy(refs[0]);
        let [eri, eci] = [sri, sci];
        if (refs.length > 1) {
            [eci, eri] = expr2xy(refs[1]);
        }
        return new CellRange(sri, sci, eri, eci);
    }
}


export {
    CellRange,
};
