import axios from 'axios'
import { IUser, IArticle } from '../types'
import blobToBase64 from '../utils/blobToBase64'

interface BaseRes {
  stat: string
  message?: string
}

interface PersonRes extends BaseRes {
  data: {
    token: string
  }
}
interface UserRes extends BaseRes {
  data: 
     IUser
  
}
interface CheckUserRes extends BaseRes {
  data: {
    user: IUser
  }
}
interface ListRes extends BaseRes {
  data: {
    items: IArticle[],
    total: number
  }
}

interface DetailRes extends BaseRes {
  data: {
    info: IArticle
  }
}
interface AddRes extends BaseRes {
  data: string
}

// 注册
export async function register(account: string, pwd: string) {
  let result = await axios.post<UserRes>('/api/auth/registry', { account, pwd })
  return result.data
}

// 登录
export async function login(account: string, pwd: string) {
  let result = await axios.post<PersonRes>('/api/auth/login', { account, pwd })
  return result.data
}
// 退出
export async function logout() {
  let result = await axios.post<UserRes>('/api/auth/logout')
  return result.data
}
// 查找用户
export async function check(account: string) {
  let result = await axios.post<CheckUserRes>('/api/auth/check', { account })
  return result.data
}
// 更新密码
export async function updatePwd(id: string, oldPwd: string, newPwd: string) {
  let result = await axios.put('/api/user/updatePwd/', { id, oldPwd, newPwd })
  return result.data
}

// 获取用户信息
export async function userInfo() {
  let result = await axios.get<UserRes>('/api/user/userInfo')
  return result.data

}
// 更新用户信息
export async function updateUser(id: string, nickname: string, avatar: string) {
  let result = await axios.put('/api/user/updateUserInfo/', { id, nickname, avatar })
  return result.data
}

// 获取用户文章
export async function getUserArticles(pageIndex: number, pageSize: number, keyword: string) {
  let result = await axios.post<ListRes>('/api/article/searchOwner', {
    pageIndex,
    pageSize,
    keyword
  })
  return result.data
}
// 获取所有文章
export async function getAllArticles(pageIndex: number, pageSize: number, keyword: string, sort?: string) {
  let result = await axios.post<ListRes>('/api/article/searchAll', {
    pageIndex,
    pageSize,
    keyword,
    sort
  })
  return result.data
}
// 添加文章
export async function addArticle(title: string, subTitle: string, content: string, tags: string[], banner: string[]) {
  let result = await axios.post<AddRes>('/api/article/add', {
    title,
    subTitle,
    content,
    tags,
    banner
  })
  return result.data
}
// 更新文章
export async function editArticle(id: string, title: string, subTitle: string, content: string, tags: string[], banner: string[]) {
  let result = await axios.put<BaseRes>(`/api/article/${id}`, {
    title,
    subTitle,
    content,
    tags,
    banner
  })
  return result.data
}
// 文章详情
export async function detail(id: string) {
  let result = await axios.get<DetailRes>(`/api/article/${id}`)
  return result.data
}
// 删除文章
export async function delArticle(id: string) {
  let result = await axios.delete<BaseRes>('/api/article/' + id)
  return result.data
}

// 上传图片
export async function upload(File: any) {
  let data = new FormData();
  data.append('file', File[0]);
  let result: any = await axios.post('/api/file/upload/', data
  )
  return result.data
}
// 根据 key获取图片
export async function getAvatar(key: string) {
  let result: any = await axios.get('/api/file/preview/' + key, { responseType: 'blob' }
  )
  return blobToBase64(result.data)
}
// 将base转化为img格式，未完成
export async function transform(imgData: string, layout_id: string) {
  let result: any = await axios.post('/api/file/transform', { imgData, layout_id }
  )
  return result
}
export async function getPicture(key: string) {
  let result: any = await axios.get('/api/file/download/' + key,
  )
  return result
}
