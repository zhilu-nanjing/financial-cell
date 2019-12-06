import helper from "../../helper/dataproxy_helper";
//XW: end
//XW:大括号参数判断,有大括号参数用''包起来作为一个参数
exports.trans_params = function (cell) {
  let reg = new RegExp('\{(.*?)\}', 'g');
  let arg = cell.f.match(reg);
  if (arg !== null){
    for (let i=0; i<arg.length; i++){
      let param = arg[i];
      let rep = "'" + param + "'";
      cell.f = cell.f.replace(param, rep)
    }
  }
  return cell
};
//XW:end
//XW: 将空单元格置为default_0
exports.trans_sheet = function (sheet) {
  Object.keys(sheet).forEach(i => {
    if (sheet[i].v === 0 && sheet[i].f === ""){
      sheet[i].v = 'default_0'
    }
  });
  return sheet
};

exports.recover_sheet = function (sheet) {
  Object.keys(sheet).forEach(i => {
    if (sheet[i].v === 'default_0'){
      if (!helper.isHave(sheet[i].f)) {
        sheet[i].f = ""
      }
      sheet[i].v = 0
    }
  });
  return sheet
};
//XW: end
//XW: 去除公式开头结尾的空格
exports.strim = function (str){
  let str1 = str.replace(/\s+$/,'');
  let str2 = str1.replace(/^\s+/,'');
  return str2;
};
//XW： end

//xW: 公式参数转换
exports.trans_formula = function(f){
  //特殊公式转换 FLOOR->FLOORMATH, vap-> vara等
  let trans_dict = {
    'FLOOR': 'FLOORMATH',
    'let': 'VARA',
    'WORKDAY.INTL': 'WORKDAYINTL'
  };
  for(let i in trans_dict){
    let b = trans_dict[i];
    if (f.indexOf(b) < 0 && f.indexOf(i)>=0 && f.indexOf(i + '.') <=0){
      f = f.replace(i, b)
    }
  }
  //_XLFN. 开头的函数去掉开头
  f = f.replace('_XLFN.', '');
  //将函数公式中除""中的其他部分转成大写
  let reg = new RegExp('"(.*?)"', 'g');
  let arg = f.match(reg);
  if (f.indexOf('=') === 0){
    f = f.toUpperCase();
    if (arg !== null) {
      for (let i = 0; i < arg.length; i++) {
        let param = arg[i].toUpperCase();
        if(f.indexOf(param) >= 0){
          f = f.replace(param, arg[i])
        }
      }
    }
  }
  return f
};
//xW:end
