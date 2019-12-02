const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export function stringAt(index) {
  let str = '';
  let cindex = index;
  while (cindex >= alphabets.length) {
    cindex /= alphabets.length;
    cindex -= 1;
    str += alphabets[parseInt(cindex, 10) % alphabets.length];
  }
  const last = index % alphabets.length;
  str += alphabets[last];
  return str;
}

export function  indexAt(str) {
  let ret = 0;
  for (let i = 0; i < str.length - 1; i += 1) {
    const cindex = str.charCodeAt(i) - 65;
    const exponet = str.length - 1 - i;
    ret += (alphabets.length ** exponet) + (alphabets.length * cindex);
  }
  ret += str.charCodeAt(str.length - 1) - 65;
  return ret;
}

// B10 => x,y
export function expr2xy(src) {
  let x = '';
  let y = '';
  for (let i = 0; i < src.length; i += 1) {
    if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
      y += src.charAt(i);
    } else {
      x += src.charAt(i);
    }
  }
  return [indexAt(x), parseInt(y, 10) - 1];
}

// export function expr2expr(src, xn, yn) {
//   const [x, y] = expr2xy(src);
//   return stringAt(x + xn) + (y + yn);
// }

// x,y => B10  x ci y ri
export function xy2expr(x, y, ab = 0) {
  x = x * 1;
  y = y * 1;
  if(ab === 2) {
    return `${stringAt(x)}$${y + 1}`;
  } else if(ab === 1) {
      return `$${stringAt(x)}${y + 1}`;
  }
  return `${stringAt(x)}${y + 1}`;
}

export default {
  expr2xy,
  xy2expr,
};
