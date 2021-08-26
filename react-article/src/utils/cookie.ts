import cookie from 'react-cookies'

const token = "userToken"

// 存cookie
export function setCookie(value:string) {
  cookie.save(token, value, { path: '/'})
}
// 取cookie
export function getCookie() {
  return cookie.load(token)
}
// 删除cookie
export function delCookie () {
  cookie.remove(token, { path: '/' })
}

