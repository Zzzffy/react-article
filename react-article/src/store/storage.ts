// getVal是获取主要是给state定义初始值
// name：传入字符串是存于session的名称一般与state取名一致
// val:设置state初始值时赋予的值，可不传，默认为空
export const getVal = function (name: string, val = "") {
  try {

    if (localStorage.getItem(name) !== undefined && localStorage.getItem(name) !== '') {
      return JSON.parse(localStorage.getItem(name)||'');
    } else {
      return val
    }
  } catch (error) {
    return ""
  }

}
// setVal是获取主要是给state更新值
// name：传入字符串是存于session的名称一般与state取名一致
// obj:更新的值
export const setVal = function (name:string, obj:any) {
  let ret = JSON.stringify(obj)
  localStorage.setItem(name, ret);
}

export const delVal = function (name:string) {
  localStorage.removeItem(name);
}
