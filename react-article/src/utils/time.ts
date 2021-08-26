export default function getAgoAt(ctime: number) {
  var now: any = new Date()
  var current_time = Date.parse(now);
  var diff = (current_time - ctime) / 1000;
  var agoAt = '刚刚';
  var timePoints = [
    { value: 60 * 60 * 24 * 365, suffix: '年前', max: 2 },
    { value: 60 * 60 * 24 * 30, suffix: '月前', max: 11 },
    { value: 60 * 60 * 24 * 7, suffix: '周前', max: 4 },
    { value: 60 * 60 * 24, suffix: '天前', max: 6 },
    { value: 60 * 60, suffix: '小时前', max: 23 },
    { value: 60 , suffix: '分钟前', max: 56 }
  ];

  for (var i = 0; i < timePoints.length; i++) {
    var point = timePoints[i];
    var mode = Math.floor(diff / point.value);
    if (mode > 1) {
      agoAt = Math.min(mode, point.max) + point.suffix;
      break;
    }
  }
  return agoAt;
}