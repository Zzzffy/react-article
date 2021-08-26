
export interface IPerson{
  account: string
  pwd: string
  remember?:boolean
}
export interface IUser{
  _id: string
  account: string
  pwd?: string
  avatar: string
  nickname: string
  status?: number
  ctime: number
}
export interface IArticle {
  _id: string
  title: string
  subTitle: string
  content: string
  ctime: string
  avatar: string
  author: IUser
  preview: number // 浏览量
  tags: string //标签
  banner: string[]
}
