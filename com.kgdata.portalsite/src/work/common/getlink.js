const r = 7;

export function genLinkPath(d) {
  let tan = Math.abs((d.target.y - d.source.y) / (d.target.x - d.source.x)); // 圆心连线tan值
  if (isNaN(tan)) {
    tan = 0;
  }
  let x1 = d.target.x - d.source.x > 0 ? Math.sqrt(r * r / (tan * tan + 1)) + d.source.x : d.source.x - Math.sqrt(r * r / (tan * tan + 1)); // 起点x坐标
  let y1 = d.target.y - d.source.y > 0 ? Math.sqrt(r * r * tan * tan / (tan * tan + 1)) + d.source.y : d.source.y - Math.sqrt(r * r * tan * tan / (tan * tan + 1)); // 起点y坐标
  let x2 = d.target.x - d.source.x > 0 ? d.target.x - Math.sqrt(r * r / (1 + tan * tan)) : d.target.x + Math.sqrt(r * r / (1 + tan * tan)); // 终点x坐标
  let y2 = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt(r * r * tan * tan / (1 + tan * tan)) : d.target.y + Math.sqrt(r * r * tan * tan / (1 + tan * tan)); // 终点y坐标
  if (d.target.x - d.source.x === 0 || tan === 0) { // 斜率无穷大的情况或为0时
    y1 = d.target.y - d.source.y > 0 ? d.source.y + r : d.source.y - r;
    y2 = d.target.y - d.source.y > 0 ? d.target.y - r : d.target.y + r;
  }
  if (d.linknum === 0) { // 设置编号为0的连接线为直线，其他连接线会均分在两边
    // d.x_start = x1;
    // d.y_start = y1;
    // d.x_end = x2;
    // d.y_end = y2;
    return 'M' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
  }
  let maxLinkNumber = d.size % 2 == 0 ? d.size / 2
    : (d.size - 1) / 2;
  // let a= ((r-2)/maxLinkNumber)*d.linknum
  let a = r * d.linknum / 6;
  let xm = d.target.x - d.source.x > 0 ? d.source.x + Math.sqrt((r * r - a * a) / (1 + tan * tan)) : d.source.x - Math.sqrt((r * r - a * a) / (1 + tan * tan));
  let ym = d.target.y - d.source.y > 0 ? d.source.y + Math.sqrt((r * r - a * a) * tan * tan / (1 + tan * tan)) : d.source.y - Math.sqrt((r * r - a * a) * tan * tan / (1 + tan * tan));
  let xn = d.target.x - d.source.x > 0 ? d.target.x - Math.sqrt((r * r - a * a) / (1 + tan * tan)) : d.target.x + Math.sqrt((r * r - a * a) / (1 + tan * tan));
  let yn = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt((r * r - a * a) * tan * tan / (1 + tan * tan)) : d.target.y + Math.sqrt((r * r - a * a) * tan * tan / (1 + tan * tan));
  if (d.target.x - d.source.x == 0 || tan == 0) { // 斜率无穷大或为0时
    ym = d.target.y - d.source.y > 0 ? d.source.y + Math.sqrt(r * r - a * a) : d.source.y - Math.sqrt(r * r - a * a);
    yn = d.target.y - d.source.y > 0 ? d.target.y - Math.sqrt(r * r - a * a) : d.target.y + Math.sqrt(r * r - a * a);
  }
  let k = (x1 - x2) / (y2 - y1); // 连线垂线的斜率
  let dx = Math.sqrt(a * a / (1 + k * k)); // 相对垂点x轴距离
  let dy = Math.sqrt(a * a * k * k / (1 + k * k)); // 相对垂点y轴距离
  if ((y2 - y1) == 0) {
    dx = 0;
    dy = Math.sqrt(a * a);
  }
  let xs;
  let ys;
  let xt;
  let yt;
  if (a > 0) {
    xs = k > 0 ? xm - dx : xm + dx;
    ys = ym - dy;
    xt = k > 0 ? xn - dx : xn + dx;
    yt = yn - dy;
  } else {
    xs = k > 0 ? xm + dx : xm - dx;
    ys = ym + dy;
    xt = k > 0 ? xn + dx : xn - dx;
    yt = yn + dy;
  }
  // 记录连线起始和终止坐标，用于定位线上文字
  // d.x_start = x1;
  // d.y_start = y1;
  // d.x_end = x2;
  // d.y_end = y2;
  return 'M' + xs + ' ' + ys + ' L ' + xt + ' ' + yt;
}

export function getLineTextDx(d) {
  let sx = d.source.x;
  let sy = d.source.y;
  let tx = d.target.x;
  let ty = d.target.y;
  let distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
  let textLength = d.ooName?d.ooName.length*4:d.name.length*4;
  let deviation = 8; // 调整误差
  let dx = (distance - textLength -2*r) / 2 ;
  return dx;
}
