function isHave(param) {
  if (typeof param === "undefined") {
    return false;
  }
  if (param === null) {
    return false;
  }
  return true;
}
//XW: end
//XW:大括号参数判断,有大括号参数用''包起来作为一个参数
exports.trans_params = function (cell) {
  var reg = new RegExp('\{(.*?)\}', 'g')
  var arg = cell.f.match(reg)
  if (arg != null){
    for (var i=0; i<arg.length; i++){
      var param = arg[i]
      var rep = "'" + param + "'"
      cell.f = cell.f.replace(param, rep)
    }
  }
  return cell
}
//XW:end
//XW: 将空单元格置为default_0
exports.trans_sheet = function (sheet) {
  Object.keys(sheet).forEach(i => {
    if (sheet[i].v === 0 && sheet[i].f === ""){
      sheet[i].v = 'default_0'
    }
  });
  return sheet
}

exports.recover_sheet = function (sheet) {
  Object.keys(sheet).forEach(i => {
    if (sheet[i].v === 'default_0'){
      if (!isHave(sheet[i].f)) {
        sheet[i].f = ""
      }
      sheet[i].v = 0
    }
  });
  return sheet
}
//XW: end
//XW: 去除公式开头结尾的空格
exports.strim = function (str){
  let str1 = str.replace(/\s+$/,'');
  let str2 = str1.replace(/^\s+/,'')
  return str2;
}
//XW： end

//xW: 公式参数转换
exports.trans_formula = function(f){
  //特殊公式转换 FLOOR->FLOORMATH, vap-> vara等
  var trans_dict = {
    'FLOOR': 'FLOORMATH',
    'VAR': 'VARA',
    'WORKDAY.INTL': 'WORKDAYINTL'
  }
  for(var i in trans_dict){
    var b = trans_dict[i]
    if (f.indexOf(b) < 0 && f.indexOf(i)>=0 && f.indexOf(i + '.') <=0){
      f = f.replace(i, b)
    }
  }
  //_XLFN. 开头的函数去掉开头
  f = f.replace('_XLFN.', '')
  //将函数公式中除""中的其他部分转成大写
  var reg = new RegExp('"(.*?)"', 'g')
  var arg = f.match(reg)
  if (f.indexOf('=') === 0){
    f = f.toUpperCase()
    if (arg != null) {
      for (var i = 0; i < arg.length; i++) {
        var param = arg[i].toUpperCase()
        if(f.indexOf(param) >= 0){
          f = f.replace(param, arg[i])
        }
      }
    }
  }
  return f
}
//xW:end
