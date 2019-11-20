import City from '../core/city';

export default class Citys {
    constructor() {
        this.lianjia = [];
        this.lianJiaUrl();
    }

    lianJiaUrl() {
        this.lianjia.push(new City("南京", 0, "https://nj.lianjia.com/ditu/"));
        this.lianjia.push(new City("合肥", 0, "https://hf.lianjia.com/ditu"));
        this.lianjia.push(new City("安庆", 0, "https://aq.lianjia.com/ditu"));
        this.lianjia.push(new City("滁州", 0, "https://cz.fang.lianjia.com"));
        this.lianjia.push(new City("马鞍山", 0, "https://mas.lianjia.com/ditu"));
        this.lianjia.push(new City("北京", 0, "https://bj.lianjia.com/ditu"));
        this.lianjia.push(new City("重庆", 0, "https://cq.lianjia.com/ditu"));
        this.lianjia.push(new City("福州", 0, "https://fz.lianjia.com/ditu"));
        this.lianjia.push(new City("泉州", 0, "https://quanzhou.lianjia.com/ditu"));
        this.lianjia.push(new City("厦门", 0, "https://xm.lianjia.com/ditu"));
        this.lianjia.push(new City("漳州", 0, "https://zhangzhou.lianjia.com/ditu"));
        this.lianjia.push(new City("东莞", 0, "https://dg.lianjia.com/ditu"));
        this.lianjia.push(new City("佛山", 0, "https://fs.lianjia.com/ditu"));
        this.lianjia.push(new City("广州", 0, "https://gz.lianjia.com/ditu"));
        this.lianjia.push(new City("惠州", 0, "https://hui.lianjia.com/ditu"));
        this.lianjia.push(new City("江门", 0, "https://jiangmen.lianjia.com/ditu"));
        this.lianjia.push(new City("清远", 0, "https://qy.lianjia.com/ditu"));
        this.lianjia.push(new City("深圳", 0, "https://sz.lianjia.com/ditu"));
        this.lianjia.push(new City("珠海", 0, "https://zh.lianjia.com/ditu"));
        this.lianjia.push(new City("湛江", 0, "https://zhanjiang.lianjia.com/ditu"));
        this.lianjia.push(new City("中山", 0, "https://zs.lianjia.com/ditu"));
        this.lianjia.push(new City("贵阳", 0, "https://gy.lianjia.com/ditu"));
    }
}