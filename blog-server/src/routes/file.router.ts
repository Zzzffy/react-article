import * as Router from 'koa-router'
import { File } from 'formidable'
import { fileKit, tokenKit } from '../kits'
import { Context } from 'vm'
import { check, generateOk } from '../libs/check'
import { ContentType } from '../libs/contentType'
import * as path from 'path'
import * as fs from 'fs'


const router = new Router({
  prefix: '/api/file',
})

/**
 * FormData文件上传
 */
router.post('/upload', async (ctx: Context) => {
  const token = ctx.cookies.get('token')
  check(!!token)
  let tokenCol = await tokenKit.findOne(token)
  check(!!tokenCol)
  // console.log(ctx.request.body)为空对象，但是下面信息可以获取到
  const file = Object.values(ctx.request.files)[0] as File
  const key = await fileKit.upload(file.path, file.size, file.name)
  ctx.body = generateOk(key)
})


/**
 * 根据key访问文件（用来展示图片）
 */
router.get('/preview/:key', async (ctx) => {
  const key = ctx.params.key
  const file = await fileKit.find(key)
  check(!!file, 'Err_File_Not_Found')
  ctx.res.setHeader(
    'Content-Type',
    // ContentType.get(path.extname(file.name)) || 'application/octet-stream',
    ContentType.get(path.extname(file.name)) || 'application/octet-stream',
  )
  ctx.res.setHeader(
    'Content-Disposition',
    'inline; filename=' + encodeURIComponent(file.name),
  )
  ctx.status = 200
  ctx.res.end(file.data.buffer)
})

/**
 * 根据key下载文件（和上面功能一样？）
 */
router.get('/download/:key', async (ctx) => {
  const key = ctx.params.key
  const file = await fileKit.find(key)
  console.log(file)
  check(!!file, 'Err_File_Not_Found')
  ctx.set('Content-Type', 'application/octet-stream')
  ctx.res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + encodeURIComponent(file.name),
  )
  ctx.body = file.data.buffer
})

export default router
