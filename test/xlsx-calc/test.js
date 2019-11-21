import {describe, it} from "mocha";
import DataProxy from "../../src/core/data_proxy";

describe('  calc  ', () => {
    let data = new DataProxy("sheet1", {}, {});

    it(' test ', function () {
        this.workbook = [];
        this.workbook.Sheets = {};
        this.workbook.Sheets[data.name] = {
            A1: {v: "1", f: "1", z: true},
            A2: {v: "2", f: "2", z: true},
            A3: {v: "=average(A1:A2)", f: "=average(A1:A2)", z: true},
        };

        data.calc(data.rows.workbook.workbook);
    });
});
