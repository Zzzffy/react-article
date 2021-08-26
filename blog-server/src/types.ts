import { Binary, Long } from "mongodb";
// 状态
export enum Status {
  delete = -1,
  normal,
}
// 文章
export interface IArticle {
  content: string       // 内容
  title: string         // 标题
  subTitle: string      // 副标题
  tags: string          // 标签
  ctime: number         // 创建时间
  mtime: number         // 
  status?: number       // 状态
  banner: string[]      // banner图
  preview: number       // 浏览量
  author: string        // 作者
}
export interface ITag {
  title: string
  ctime: number
  status?: Status
}
// 用户
export interface IUser {
  nickname: string      // 昵称
  account: string       // 用户名
  avatar: string       // 头像
  pwd: string         // 密码
  ctime: number       // 创建时间
  status: Status      // 状态
}

// token
export interface IToken {
  userId: string    // 用户id
  // token: string
}

// 文件类型
export interface IFile {
  key: string
  name: string
  data: Binary
  size: number
  createdAt: Long
}