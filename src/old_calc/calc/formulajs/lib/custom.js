var error = require('./error');
//XW: 自定义函数
exports.PQUERY = function () {
  if (arguments.length !== 5) {
    return error.error;
  }

  if (arguments[0].length !== arguments[1].length) {
    return error.error;
  }

  if (arguments[1].length !== arguments[3].length) {
    return error.error;
  }

  // 计算出绝对值
  let absArr = [];
  let o1 = arguments[4];
  for (let i = 0; i < arguments[3].length; i++) {
    arguments[3][i] = parseFloat(arguments[3][i]);
    if (!isNaN(arguments[3][i])) {
      absArr.push({
        number: i,
        value: Math.abs(arguments[3][i] - o1)
      });
    }
  }
  absArr = absArr.sort((obj1, obj2) => {
    var val1 = obj1.value;
    var val2 = obj2.value;
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  });


  let items = [];
  let count = 1;
  for (let i = 0; i < absArr.length; i++) {
    let {number, value} = absArr[i];
    let a1 = arguments[0][number][0];
    let a2 = arguments[1][number][0];
    let a4 = arguments[3][number];

    if (a2 === arguments[2]) {
      items.push({
        number: count,
        name: a1,
        city: a2,
        area: a4,
        value: value
      });
      count = count + 1;
    }
  }

  return '*悬浮查看*!' + JSON.stringify(items);
};

exports.HYPERLINK = function () {
  console.log(arguments);
  if (!arguments || !arguments[0] || !arguments[1]) {
    return error.na;
  }
  let url = arguments[0];
  if (url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 8).toLowerCase() == "https://") {
    url = url;
  } else {
    url = "http://" + url;
  }

  let cell = {
    "text": arguments[1],
    "url": url
  }
  return "*HYPERLINK*!" + JSON.stringify(cell) + " ";
}

function City(name, type, url) {
  this.name = name;
  this.type = type;
  this.url = url;
}

function lianJiaUrl(lianjia) {
  lianjia.push(new City("合肥", 0, "https://hf.lianjia.com/ditu"));
  lianjia.push(new City("安庆", 0, "https://aq.lianjia.com/ditu"));
  lianjia.push(new City("滁州", 0, "https://cz.fang.lianjia.com/ditu/"));
  lianjia.push(new City("马鞍山", 0, "https://mas.lianjia.com/ditu"));
  lianjia.push(new City("北京", 0, "https://bj.lianjia.com/ditu"));
  lianjia.push(new City("重庆", 0, "https://cq.lianjia.com/ditu"));
  lianjia.push(new City("福州", 0, "https://fz.lianjia.com/ditu"));
  lianjia.push(new City("泉州", 0, "https://quanzhou.lianjia.com/ditu"));
  lianjia.push(new City("厦门", 0, "https://xm.lianjia.com/ditu"));
  lianjia.push(new City("漳州", 0, "https://zhangzhou.lianjia.com/ditu"));
  lianjia.push(new City("东莞", 0, "https://dg.lianjia.com/ditu"));
  lianjia.push(new City("佛山", 0, "https://fs.lianjia.com/ditu"));
  lianjia.push(new City("广州", 0, "https://gz.lianjia.com/ditu"));
  lianjia.push(new City("惠州", 0, "https://hui.lianjia.com/ditu"));
  lianjia.push(new City("江门", 0, "https://jiangmen.lianjia.com/ditu"));
  lianjia.push(new City("清远", 0, "https://qy.lianjia.com/ditu"));
  lianjia.push(new City("深圳", 0, "https://sz.lianjia.com/ditu"));
  lianjia.push(new City("珠海", 0, "https://zh.lianjia.com/ditu"));
  lianjia.push(new City("湛江", 0, "https://zhanjiang.lianjia.com/ditu"));
  lianjia.push(new City("中山", 0, "https://zs.lianjia.com/ditu"));
  lianjia.push(new City("贵阳", 0, "https://gy.lianjia.com/ditu"));

  lianjia.push(new City("北海", 0, "https://bh.lianjia.com/ditu"));
  lianjia.push(new City("防城港", 0, "https://fcg.lianjia.com/ditu"));
  lianjia.push(new City("桂林", 0, "https://gl.lianjia.com/ditu"));
  lianjia.push(new City("柳州", 0, "https://liuzhou.lianjia.com/ditu"));
  lianjia.push(new City("南宁", 0, "https://nn.lianjia.com/ditu"));

  lianjia.push(new City("兰州", 0, "https://lz.lianjia.com/ditu"));

  lianjia.push(new City("鄂州", 0, "https://ez.lianjia.com/ditu"));
  lianjia.push(new City("黄石", 0, "https://huangshi.lianjia.com/ditu"));
  lianjia.push(new City("武汉", 0, "https://wh.lianjia.com/ditu"));
  lianjia.push(new City("襄阳", 0, "https://xy.lianjia.com/ditu"));
  lianjia.push(new City("宜昌", 0, "https://yichang.lianjia.com/ditu"));

  lianjia.push(new City("长沙", 0, "https://cs.lianjia.com/ditu"));
  lianjia.push(new City("常德", 0, "https://changde.lianjia.com/ditu"));
  lianjia.push(new City("岳阳", 0, "https://yy.lianjia.com/ditu"));
  lianjia.push(new City("株洲", 0, "https://zhuzhou.lianjia.com/ditu"));

  lianjia.push(new City("保定", 0, "https://bd.lianjia.com/ditu"));
  lianjia.push(new City("廊坊", 0, "https://lf.lianjia.com/ditu"));
  lianjia.push(new City("秦皇岛", 0, "https://qhd.fang.lianjia.com/ditu"));
  lianjia.push(new City("石家庄", 0, "https://sjz.lianjia.com/ditu"));
  lianjia.push(new City("唐山", 0, "https://ts.lianjia.com/ditu"));
  lianjia.push(new City("张家口", 0, "https://zjk.lianjia.com/ditu"));

  lianjia.push(new City("保亭", 0, "https://bt.fang.lianjia.com/ditu"));
  lianjia.push(new City("澄迈", 0, "https://cm.fang.lianjia.com/ditu"));
  lianjia.push(new City("儋州", 0, "https://dz.fang.lianjia.com/ditu"));
  lianjia.push(new City("海口", 0, "https://hk.lianjia.com/ditu"));
  lianjia.push(new City("临高", 0, "https://lg.fang.lianjia.com/ditu"));
  lianjia.push(new City("乐东", 0, "https://ld.fang.lianjia.com/ditu"));
  lianjia.push(new City("陵水", 0, "https://ls.fang.lianjia.com/ditu"));
  lianjia.push(new City("琼海", 0, "https://qh.fang.lianjia.com/ditu"));
  lianjia.push(new City("三亚", 0, "https://san.lianjia.com/ditu"));
  lianjia.push(new City("五指山", 0, "https://wzs.fang.lianjia.com/ditu"));
  lianjia.push(new City("文昌", 0, "https://wc.fang.lianjia.com/ditu"));
  lianjia.push(new City("万宁", 0, "https://wn.fang.lianjia.com/ditu"));

  lianjia.push(new City("开封", 0, "https://kf.lianjia.com/ditu"));
  lianjia.push(new City("洛阳", 0, "https://luoyang.lianjia.com/ditu"));
  lianjia.push(new City("新乡", 0, "https://xinxiang.lianjia.com/ditu"));
  lianjia.push(new City("许昌", 0, "https://xc.lianjia.com/ditu"));
  lianjia.push(new City("郑州", 0, "https://zz.lianjia.com/ditu"));

  lianjia.push(new City("哈尔滨", 0, "https://kf.lianjia.com/ditu"));

  lianjia.push(new City("常州", 0, "https://changzhou.lianjia.com/ditu"));
  lianjia.push(new City("淮安", 0, "https://ha.lianjia.com/ditu"));
  lianjia.push(new City("昆山", 0, "https://ks.lianjia.com/ditu"));
  lianjia.push(new City("南京", 0, "https://nj.lianjia.com/ditu/"));
  lianjia.push(new City("南通", 0, "https://nt.lianjia.com/ditu"));
  lianjia.push(new City("苏州", 0, "https://su.lianjia.com/ditu"));
  lianjia.push(new City("无锡", 0, "https://wx.lianjia.com/ditu"));
  lianjia.push(new City("徐州", 0, "https://xz.lianjia.com/ditu"));
  lianjia.push(new City("盐城", 0, "https://yc.lianjia.com/ditu"));
  lianjia.push(new City("镇江", 0, "https://zj.lianjia.com/ditu"));

  lianjia.push(new City("长春", 0, "https://cc.lianjia.com/ditu/"));
  lianjia.push(new City("吉林", 0, "https://jl.lianjia.com/ditu"));

  lianjia.push(new City("赣州", 0, "https://ganzhou.lianjia.com/ditu"));
  lianjia.push(new City("九江", 0, "https://jiujiang.lianjia.com/ditu"));
  lianjia.push(new City("吉安", 0, "https://jian.lianjia.com/ditu"));
  lianjia.push(new City("南昌", 0, "https://nc.lianjia.com/ditu"));
  lianjia.push(new City("上饶", 0, "https://sr.lianjia.com/ditu"));

  lianjia.push(new City("大连", 0, "https://dl.lianjia.com/ditu"));
  lianjia.push(new City("丹东", 0, "https://dd.lianjia.com/ditu"));
  lianjia.push(new City("沈阳", 0, "https://sy.lianjia.com/ditu"));

  lianjia.push(new City("呼和浩特", 0, "https://hhht.lianjia.com/ditu"));

  lianjia.push(new City("银川", 0, "https://yinchuan.lianjia.com/ditu"));

  lianjia.push(new City("银川", 0, "https://yinchuan.lianjia.com/ditu"));

  lianjia.push(new City("上海", 0, "https://sh.lianjia.com/ditu"));

  lianjia.push(new City("成都", 0, "https://cd.lianjia.com/ditu"));
  lianjia.push(new City("德阳", 0, "https://dy.fang.lianjia.com/ditu"));
  lianjia.push(new City("达州", 0, "https://dazhou.lianjia.com/ditu"));
  lianjia.push(new City("乐山", 0, "https://leshan.fang.lianjia.com/ditu"));
  lianjia.push(new City("凉山", 0, "https://liangshan.lianjia.com/ditu"));
  lianjia.push(new City("绵阳", 0, "https://mianyang.lianjia.com/ditu"));
  lianjia.push(new City("眉山", 0, "https://ms.fang.lianjia.com/ditu"));
  lianjia.push(new City("南充", 0, "https://nanchong.lianjia.com/ditu"));

  lianjia.push(new City("济南", 0, "https://jn.lianjia.com/ditu"));
  lianjia.push(new City("临沂", 0, "https://linyi.lianjia.com/ditu"));
  lianjia.push(new City("青岛", 0, "https://qd.lianjia.com/ditu"));
  lianjia.push(new City("潍坊", 0, "https://wf.lianjia.com/ditu"));
  lianjia.push(new City("威海", 0, "https://weihai.lianjia.com/ditu"));
  lianjia.push(new City("烟台", 0, "https://yt.lianjia.com/ditu"));
  lianjia.push(new City("淄博", 0, "https://zb.lianjia.com/ditu"));

  lianjia.push(new City("宝鸡", 0, "https://baoji.lianjia.com/ditu"));
  lianjia.push(new City("汉中", 0, "https://hanzhong.lianjia.com/ditu"));
  lianjia.push(new City("西安", 0, "https://xa.lianjia.com/ditu"));
  lianjia.push(new City("咸阳", 0, "https://xianyang.lianjia.com/ditu"));

  lianjia.push(new City("晋中", 0, "https://jz.fang.lianjia.com/ditu"));
  lianjia.push(new City("太原", 0, "https://ty.lianjia.com/ditu"));

  lianjia.push(new City("天津", 0, "https://tj.lianjia.com/ditu"));

  lianjia.push(new City("大理", 0, "https://dali.lianjia.com/ditu"));
  lianjia.push(new City("昆明", 0, "https://km.lianjia.com/ditu"));
  lianjia.push(new City("西双版纳", 0, "https://xsbn.fang.lianjia.com/ditu"));

  lianjia.push(new City("杭州", 0, "https://hz.lianjia.com/ditu"));
  lianjia.push(new City("湖州", 0, "https://huzhou.lianjia.com/ditu"));
  lianjia.push(new City("嘉兴", 0, "https://jx.lianjia.com/ditu"));
  lianjia.push(new City("金华", 0, "https://jh.lianjia.com/ditu"));
  lianjia.push(new City("宁波", 0, "https://nb.lianjia.com/ditu"));
  lianjia.push(new City("绍兴", 0, "https://sx.lianjia.com/ditu"));
  lianjia.push(new City("台州", 0, "https://taizhou.lianjia.com/ditu"));
  lianjia.push(new City("温州", 0, "https://wz.lianjia.comditu"));
}

function woaiwojiaUrl(woaiwojia) {
  woaiwojia.push(new City("北京", 0, "https://bj.5i5j.com/map"));
  woaiwojia.push(new City("杭州", 0, "https://hz.5i5j.com/map"));
  woaiwojia.push(new City("青岛", 0, "https://qd.5i5j.com/map"));
  woaiwojia.push(new City("天津", 0, "https://tj.5i5j.com/map"));
  woaiwojia.push(new City("太原", 0, "https://zz.5i5j.com/map"));
  woaiwojia.push(new City("郑州", 0, "https://zz.5i5j.com/map"));
  woaiwojia.push(new City("成都", 0, "https://cd.5i5j.com/map"));
  woaiwojia.push(new City("长沙", 0, "https://cs.5i5j.com/map"));
  woaiwojia.push(new City("南昌", 0, "https://nc.5i5j.com/map"));
  woaiwojia.push(new City("南京", 0, "https://nj.5i5j.com/map"));
  woaiwojia.push(new City("南宁", 0, "https://nn.5i5j.com/map"));
  woaiwojia.push(new City("上海", 0, "https://sh.5i5j.com/map"));
  woaiwojia.push(new City("苏州", 0, "https://sz.5i5j.com/map"));
  woaiwojia.push(new City("武汉", 0, "https://wh.5i5j.com/map"));
  woaiwojia.push(new City("无锡", 0, "https://wx.5i5j.com/map"));
}

function fangtianxiaUrl(fangtianxia) {
  fangtianxia.push(new City("全国", 0, "https://www1.fang.com"));
}

function find(name, arr, str = true) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === name || (typeof name === 'string' && str === false)) {
      let {url} = arr[i];
      return url;
    }
  }

  return "城市未找到";
}

let lianjia = [];
lianJiaUrl(lianjia);
let woaiwojia = [];
woaiwojiaUrl(woaiwojia);
let fangtianxia = [];
fangtianxiaUrl(fangtianxia);