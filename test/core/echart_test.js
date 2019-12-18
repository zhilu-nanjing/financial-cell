import {describe, it} from "mocha";
import {changeFormat} from "../../src/utils/date";
import DataProxy from "../../src/core/data_proxy";
let assert = require('assert');

describe('echart', () => {
    let data = new DataProxy("sheet1", {}, {});

    it(' loading data', function () {
        data.setData({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    });
});