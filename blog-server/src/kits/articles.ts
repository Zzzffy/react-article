import { ObjectId } from 'mongodb'
import * as db from '../db'
import { IArticle, Status } from '../types'
import { check, Error } from '../libs/check'
import { userKit } from '.'

async function add(record: IArticle) {
  let result = await db.articleCollection.insertOne({
    ...record,
    status: Status.normal,
  })
  return result.insertedId
}

async function findOne(id: string, author: string = '') {
  let article = await db.articleCollection.findOne({
    _id: new ObjectId(id),
    status: Status.normal,
    author: { $regex: author },
  })
  check(!!article, 'Err_Article_Not_Found')
  return article
}
// 删除文章
async function remove(id: string, uid: string) {
  let result = await db.articleCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      author: uid,
    },
    {
      $set: { status: Status.delete },
    },
  )
  check(!!result, 'Err_Article_Not_Found')
}
// 查询文章
async function search(
  keyword: string,
  pageIndex: number,
  pageSize: number,
  sort: 'ctime' | 'preview',
  author: string = '',
) {
  const docs = db.articleCollection
    .find({
      status: Status.normal,
      $or: [
        { title: { $regex: keyword || '' } },
        { subtitle: { $regex: keyword || '' } },
        { content: { $regex: keyword || '' } },
        { tags: { $regex: keyword || '' } },
      ],
      author: { $regex: author },
    })
    .sort({ [sort]: -1 }) // 修改为 -1，这样返回数据就按最近时间和最多浏览量从大到小
  let total = await docs.count()
  let _items = await docs
    .limit(pageSize)
    .skip((pageIndex - 1) * pageSize)
    .toArray()
  let items = await Promise.all(
    _items.map(async (item) => {
      return { ...item, author: await userKit.findOne(item.author) }
    }),
  )
  return {
    items,
    total
  }
}
// 更新文章(可以更新banner图)
async function update(
  id: string, // 文章id
  title: string,
  subTitle: string,
  content: string,
  tags: string,
  banner: string[],
  uid: string,  // 用户id
) {
  let article = await findOne(id, uid)
  article = {
    ...article,
    title,
    subTitle,
    content,
    banner,
    tags,
    mtime: new Date().getTime(),
  }
  await db.articleCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: article,
    },
  )
}
// 浏览量，点击获取文章详情就会自动加1
async function preview(id: string) {
  let article = await findOne(id)
  article.preview += 1
  await db.articleCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: article,
    },
  )
  let newArt = {
    ...article,
    author: await userKit.findOne(article.author),
  }
  return newArt
}

export { search, add, update, remove, findOne, preview }
