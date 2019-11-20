import {changeFormula, cutStr, value2absolute} from "../core/operator";

onmessage = function(e) {
    console.log('Worker: Message received from main script');
    let arr = e.data[0];
    let arr2 = e.data[0];
    let arr3 = e.data[0];

    if (arr.length != arr2.length && arr3.length != arr2.length) {
        return;
    }
    this.each((ri) => {
        this.eachCells(ri, (ci) => {
            for (let i = 0; i < arr.length; i++) {
                let cell = this.getCell(ri, ci);
                let s1 = arr[i];
                let formulas = changeFormula(cutStr(cell.formulas));

                if (formulas.indexOf(s1) != -1) {
                    let ca = arr3[i].replace(/\$/g, "\\$");

                    this.setCellAll(ri, ci, cell.text.replace(new RegExp(ca, 'g'), arr2[i]),
                        cell.formulas.replace(ca, arr2[i]));
                } else {
                    let s = value2absolute(s1);
                    let es = value2absolute(arr2[i]);
                    if (formulas.indexOf(s.s3) != -1) {
                        s = value2absolute(arr3[i]);

                        s.s3 = s.s3.replace(/\$/g, "\\$");
                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s3, 'g'), es.s3),
                            cell.formulas.replace(new RegExp(s.s3, 'g'), es.s3));
                    } else if (formulas.indexOf(s.s2) != -1) {
                        s = value2absolute(arr3[i]);
                        s.s2 = s.s2.replace(/\$/g, "\\$");
                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s2, 'g'), es.s2),
                            cell.formulas.replace(new RegExp(s.s2, 'g'), es.s2));
                    } else if (formulas.indexOf(s.s1) != -1) {
                        s = value2absolute(arr3[i]);
                        s.s1 = s.s1.replace(/\$/g, "\\$");

                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s1, 'g'), es.s1),
                            cell.formulas.replace(new RegExp(s.s1, 'g'), es.s1));
                    }
                }
            }
        });
    });
    postMessage("");
};

