function setSelectorIsShow(arr, name, isShow, prefix) {
    let item = getSelector(arr, name, prefix);
    if (!isHave(item)) {
        return;
    }

    item.isShow = isShow;
}

function setSelectorToolbar(arr, name, prefix) {
    let item = getSelector(arr, name, prefix);
    if (!isHave(item) || item.init || !isHave(item.financialCell)) {
        return;
    }

    setTimeout(() => {
        item.financialCell.belongSheet.toolbar.moreResize();
        item.init = true;
    });
}

function getSelector(arr, name, prefix) {
    for (let i = 0; i < arr.length; i++) {
        if (prefix + arr[i].id === name) {
            return arr[i];
        }
    }

    return null;
}

function setFinancialCell(item, prefix) {
    item.financialCell = initFinancialCell(`${prefix}${item.id}`);
}

function setIsShow(arr, turn) {
    for (let i = 0; i < arr.length; i++) {
        arr[i].isShow = turn;
    }
}

function deleteDom() {
    let elements = document.getElementsByClassName("input-popper");
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function setIsNote(arr, name, prefix, note = '') {
    for (let i = 0; i < arr.length; i++) {
        arr[i][note] = (prefix + arr[i].id) === name;
    }
}

function isActive(arr, name, prefix) {
    let item = getSelector(arr, name, prefix);
    return item.isShow === 1;
}

function initFinancialCell(id) {
    let options = {
        showFreeze: true,
        showEditor: true,
        rowsInit: false,
        rowWidth: {
            state: false,
            width: 180
        },
        view: {
            height: () => {
                return document.documentElement.clientHeight - 37;
            }
        },
        row: {
            len: 200,
            height: 25,
        },
        showGrid: true,
        showToolbar: true,
        minus: false,
        col: {
            len: 26,
            width: 100,
            indexWidth: 60,
            minWidth: 10,
        },
    };

    let rows1 = {};
    // let rows1 = {
    //     0: {
    //         'cells': {
    //             0: {'text': '估值基准日期', 'formulas': '估值基准日期', 'style': 0},
    //             1: {'text': '贴现率', 'formulas': '贴现率', 'style': 1},
    //             2: {'text': '所得税率', 'formulas': '所得税率', 'style': 2},
    //             3: {'text': '', 'formulas': '', 'style': 3},
    //             4: {'text': '', 'formulas': '', 'style': 4},
    //             5: {'text': '', 'formulas': '', 'style': 5},
    //             6: {'text': '', 'formulas': '', 'style': 6},
    //             7: {'text': '', 'formulas': '', 'style': 7},
    //             8: {'text': '', 'formulas': '', 'style': 8},
    //             9: {'text': '', 'formulas': '', 'style': 9},
    //             10: {'text': '', 'formulas': '', 'style': 10},
    //             11: {'text': '', 'formulas': '', 'style': 11},
    //             12: {'text': '', 'formulas': '', 'style': 12},
    //             13: {'text': '', 'formulas': '', 'style': 13}
    //         }, 'height': 18
    //     },
    //     1: {
    //         'cells': {
    //             0: {'text': '2017/6/30', 'formulas': '2017/6/30', 'style': 14},
    //             1: {'text': '10%', 'formulas': '0.1', 'style': 15},
    //             2: {'text': '25%', 'formulas': '0.25', 'style': 16},
    //             3: {'text': '', 'formulas': '', 'style': 17},
    //             4: {'text': '', 'formulas': '', 'style': 18},
    //             5: {'text': '', 'formulas': '', 'style': 19},
    //             6: {'text': '', 'formulas': '', 'style': 20},
    //             7: {'text': '', 'formulas': '', 'style': 21},
    //             8: {'text': '', 'formulas': '', 'style': 22},
    //             9: {'text': '', 'formulas': '', 'style': 23},
    //             10: {'text': '', 'formulas': '', 'style': 24},
    //             11: {'text': '', 'formulas': '', 'style': 25},
    //             12: {'text': '', 'formulas': '', 'style': 26},
    //             13: {'text': '', 'formulas': '', 'style': 27}
    //         }, 'height': 18
    //     },
    //     2: {
    //         'cells': {
    //             0: {'text': '其他费率', 'formulas': '其他费率', 'style': 28},
    //             1: {'text': '摊销之外费率', 'formulas': '摊销之外费率', 'style': 29},
    //             2: {'text': '其他待摊项目/车道*公里', 'formulas': '其他待摊项目/车道*公里', 'style': 30},
    //             3: {'text': '2017流转税比例', 'formulas': '2017流转税比例', 'style': 31},
    //             4: {'text': '', 'formulas': '', 'style': 32},
    //             5: {'text': '自由现金流占比', 'formulas': '自由现金流占比', 'style': 33},
    //             6: {'text': '', 'formulas': '', 'style': 34},
    //             7: {'text': '', 'formulas': '', 'style': 35},
    //             8: {'text': '', 'formulas': '', 'style': 36},
    //             9: {'text': '', 'formulas': '', 'style': 37},
    //             10: {'text': '', 'formulas': '', 'style': 38},
    //             11: {'text': '', 'formulas': '', 'style': 39},
    //             12: {'text': '', 'formulas': '', 'style': 40},
    //             13: {'text': '', 'formulas': '', 'style': 41}
    //         }, 'height': 35
    //     },
    //     3: {
    //         'cells': {
    //             0: {'text': '4.5%', 'formulas': '0.045', 'style': 42},
    //             1: {'text': '19.0%', 'formulas': '0.19', 'style': 43},
    //             2: {'text': '0.369690084411967', 'formulas': '0.369690084411967', 'style': 44},
    //             3: {'text': '0.77%', 'formulas': '=0.77%', 'style': 45},
    //             4: {'text': '', 'formulas': '', 'style': 46},
    //             5: {'text': '75.91%', 'formulas': '=(1-D4)*(1-B4-A4)', 'style': 47},
    //             6: {'text': '', 'formulas': '', 'style': 48},
    //             7: {'text': '', 'formulas': '', 'style': 49},
    //             8: {'text': '', 'formulas': '', 'style': 50},
    //             9: {'text': '', 'formulas': '', 'style': 51},
    //             10: {'text': '', 'formulas': '', 'style': 52},
    //             11: {'text': '', 'formulas': '', 'style': 53},
    //             12: {'text': '', 'formulas': '', 'style': 54},
    //             13: {'text': '', 'formulas': '', 'style': 55}
    //         }, 'height': 18
    //     },
    //     4: {
    //         'cells': {
    //             0: {'text': '估值单位', 'formulas': '估值单位', 'style': 56},
    //             1: {'text': '收入增长率', 'formulas': '收入增长率', 'style': 57},
    //             2: {'text': '剩余期限', 'formulas': '剩余期限', 'style': 58},
    //             3: {'text': '经营权账面值', 'formulas': '经营权账面值', 'style': 59},
    //             4: {'text': '其他待摊项目价值', 'formulas': '其他待摊项目价值', 'style': 60},
    //             5: {'text': '2017M11TTm收入', 'formulas': '2017M11TTm收入', 'style': 61},
    //             6: {'text': '经营权费率化数值', 'formulas': '经营权费率化数值', 'style': 62},
    //             7: {'text': '收入现值', 'formulas': '收入现值', 'style': 63},
    //             8: {'text': '税前自由现金流现值', 'formulas': '税前自由现金流现值', 'style': 64},
    //             9: {'text': '摊销总税盾（线性+工作量）', 'formulas': '摊销总税盾（线性+工作量）', 'style': 65},
    //             10: {'text': '税后现值', 'formulas': '税后现值', 'style': 66},
    //             11: {'text': '现值-摊销账面值', 'formulas': '现值-摊销账面值', 'style': 67},
    //             12: {'text': '期末通行费/期初通行费', 'formulas': '期末通行费/期初通行费', 'style': 68},
    //             13: {'text': '权益比例', 'formulas': '权益比例', 'style': 69}
    //         }, 'height': 48
    //     },
    //     5: {
    //         'cells': {
    //             0: {'text': '清连高速', 'formulas': '清连高速', 'style': 70},
    //             1: {'text': '3.0%', 'formulas': '0.03', 'style': 71},
    //             2: {'text': '17.0520547945205', 'formulas': '17.0520547945205', 'style': 72},
    //             3: {'text': '7092.73034685', 'formulas': '7092.73034685', 'style': 73},
    //             4: {'text': '319.412232931939', 'formulas': '319.412232931939', 'style': 74},
    //             5: {'text': '731.096427', 'formulas': '731.096427', 'style': 75},
    //             6: {'text': '44.4%', 'formulas': '=D6*(-B6)/(1-(1+B6)^C6)/F6', 'style': 76},
    //             7: {'text': '7251.8 ', 'formulas': '=PV((1+$B$2)/(1+B6)-1,C6,-F6)', 'style': 77},
    //             8: {'text': '5504.9 ', 'formulas': '=H6*$F$4', 'style': 78},
    //             9: {
    //                 'text': '842.70 ',
    //                 'formulas': '=MIN(I6,(PV($B$2,C6,-SUM(E6)/C6)+H6*G6))*$C$2',
    //                 'style': 79
    //             },
    //             10: {'text': '4971.4 ', 'formulas': '=I6*(1-$C$2)+J6', 'style': 80},
    //             11: {'text': '-2440.8 ', 'formulas': '=K6-SUM(D6:E6)', 'style': 81},
    //             12: {'text': '1.7 ', 'formulas': '=(1+B6)^C6', 'style': 82},
    //             13: {'text': '76.37%', 'formulas': '0.7637', 'style': 83}
    //         }, 'height': 18
    //     },
    //     6: {
    //         'cells': {
    //             0: {'text': '机荷东段', 'formulas': '机荷东段', 'style': 84},
    //             1: {'text': '3.0%', 'formulas': '0.03', 'style': 85},
    //             2: {'text': '9.71232876712329', 'formulas': '9.71232876712329', 'style': 86},
    //             3: {'text': '1678.82142572', 'formulas': '1678.82142572', 'style': 87},
    //             4: {'text': '52.56993', 'formulas': '52.5699300033817', 'style': 88},
    //             5: {'text': '721.630416', 'formulas': '721.630416', 'style': 89},
    //             6: {'text': '21.0%', 'formulas': '=D7*(-B7)/(1-(1+B7)^C7)/F7', 'style': 90},
    //             7: {'text': '5011.5 ', 'formulas': '=PV((1+$B$2)/(1+B7)-1,C7,-F7)', 'style': 91},
    //             8: {'text': '3804.3 ', 'formulas': '=H7*$F$4', 'style': 92},
    //             9: {
    //                 'text': '271.12 ',
    //                 'formulas': '=MIN(I7,(PV($B$2,C7,-SUM(E7)/C7)+H7*G7))*$C$2',
    //                 'style': 93
    //             },
    //             10: {'text': '3124.3 ', 'formulas': '=I7*(1-$C$2)+J7', 'style': 94},
    //             11: {'text': '1392.9 ', 'formulas': '=K7-SUM(D7:E7)', 'style': 95},
    //             12: {'text': '1.3 ', 'formulas': '=(1+B7)^C7', 'style': 96},
    //             13: {'text': '100%', 'formulas': '1', 'style': 97}
    //         }, 'height': 18
    //     },
    //     7: {
    //         'cells': {
    //             0: {'text': '机荷西段', 'formulas': '机荷西段', 'style': 98},
    //             1: {'text': '3.0%', 'formulas': '0.03', 'style': 99},
    //             2: {'text': '9.71232876712329', 'formulas': '9.71232876712329', 'style': 100},
    //             3: {'text': '318.15912702', 'formulas': '318.15912702', 'style': 101},
    //             4: {'text': '48.35546304', 'formulas': '48.3554630410853', 'style': 102},
    //             5: {'text': '632.782016', 'formulas': '632.782016', 'style': 103},
    //             6: {'text': '4.5%', 'formulas': '=D8*(-B8)/(1-(1+B8)^C8)/F8', 'style': 104},
    //             7: {'text': '4394.5 ', 'formulas': '=PV((1+$B$2)/(1+B8)-1,C8,-F8)', 'style': 105},
    //             8: {'text': '3335.9 ', 'formulas': '=H8*$F$4', 'style': 106},
    //             9: {
    //                 'text': '57.35 ',
    //                 'formulas': '=MIN(I8,(PV($B$2,C8,-SUM(E8)/C8)+H8*G8))*$C$2',
    //                 'style': 107
    //             },
    //             10: {'text': '2559.3 ', 'formulas': '=I8*(1-$C$2)+J8', 'style': 108},
    //             11: {'text': '2192.7 ', 'formulas': '=K8-SUM(D8:E8)', 'style': 109},
    //             12: {'text': '1.3 ', 'formulas': '=(1+B8)^C8', 'style': 110},
    //             13: {'text': '100%', 'formulas': '1', 'style': 111}
    //         }, 'height': 18
    //     }
    // };


    return x.spreadsheet(`#${id}`, options, {})
        .loadData({
            styles: [{
                'bgcolor': 'rgb(197,217,241)',
                'textwrap': false,
                'color': 'rgb(0,0,0)',
                'underline': false,
                'strike': false,
                'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                'border': {},
                'valign': 'middle'
            },
                {
                    'bgcolor': 'rgb(197,217,241)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(197,217,241)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(252,213,180)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(252,213,180)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(252,213,180)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(252,213,180)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(141,180,226)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'center',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(197,217,241)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(196,215,155)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(197,217,241)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': true, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'right',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'right',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'align': 'right',
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
                {
                    'bgcolor': 'rgb(255,255,255)',
                    'textwrap': false,
                    'color': 'rgb(0,0,0)',
                    'underline': false,
                    'strike': false,
                    'font': {'name': '微软雅黑', 'size': 9.0, 'bold': false, 'italic': false},
                    'border': {},
                    'valign': 'middle'
                },
            ],
            rows: rows1,
            cols: {
                0: {'width': 78},
                1: {'width': 107},
                2: {'width': 138},
                3: {'width': 118},
                4: {'width': 108},
                5: {'width': 109},
                6: {'width': 120},
                7: {'width': 104},
                8: {'width': 99},
                9: {'width': 101},
                10: {'width': 106},
                11: {'width': 99},
                12: {'width': 92},
                13: {'width': 100}
            },
        }).change((cdata) => {
            console.log(cdata);
        });
}

function isHave(param) {
    if (typeof param === "undefined") {
        return false;
    }

    if (param === null) {
        return false;
    }

    return param !== null;
}
