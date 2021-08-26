import * as Router from 'koa-router'
import { Context } from 'koa'
import { catchError, check, generateOk } from '../libs/check'
import { articleKit, tokenKit } from '../kits'
import { IArticle } from '../types'

const router = new Router({
  prefix: '/api/article',
})
// 用户所有文章，默认按时间排序
router.post('/searchOwner', async (ctx: Context) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    let {
      pageIndex,
      pageSize,
      keyword,
      sort = 'ctime',
    } = ctx.request.body as {
      pageIndex: number
      pageSize: number
      keyword: string
      sort: 'ctime' | 'preview'
    }
    let data = await articleKit.search(
      keyword,
      pageIndex,
      pageSize,
      sort,
      tokenCol.userId,
    )
    ctx.body = generateOk(data)
  } catch (err) {
    catchError(err, ctx)
  }
})
// 所有用户所有文章
router.post('/searchAll', async (ctx: Context) => {
  try {
    let {
      pageIndex,
      pageSize,
      keyword,
      sort = 'ctime',
    } = ctx.request.body as {
      pageIndex: number
      pageSize: number
      keyword: string
      sort: 'ctime' | 'preview'
    }
    let data = await articleKit.search(keyword, pageIndex, pageSize, sort)
    ctx.body = generateOk(data)
  } catch (err) {
    catchError(err, ctx)
  }
})
// 添加文章
router.post('/add', async (ctx: Context) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    const { title, subTitle, content, tags, banner } = ctx.request.body as {
      title: string
      subTitle: string
      content: string
      tags: string[]
      banner: []
    }
    const now = new Date().getTime()
    const record: IArticle = {
      title,
      author: tokenCol.userId,
      subTitle,
      content,
      tags: tags.join(','),
      ctime: now,
      mtime: now,
      banner,
      preview: 0,
    }
    let res = await articleKit.add(record)
    ctx.body = generateOk(res)
  } catch (err) {
    catchError(err, ctx)
  }
})
// 删除文章
router.delete('/:id', async (ctx: Context) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    // check data
    await articleKit.remove(ctx.params.id, tokenCol.userId)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})
// 更新文章：也可以更新 banner图片
router.put('/:id', async (ctx: Context) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    let { title, subTitle, content, tags, banner } = ctx.request.body as {
      title: string
      subTitle: string
      content: string
      tags: string[]
      banner: []
    }
    await articleKit.update(
      ctx.params.id,
      title,
      subTitle,
      content,
      tags.join(','),
      banner,
      tokenCol.userId
    )
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})
// 获取文章详情
router.get('/:id', async (ctx: Context) => {
  try {
    const article = await articleKit.preview(ctx.params.id)
    ctx.body = generateOk({
      info: article,
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

export default router
