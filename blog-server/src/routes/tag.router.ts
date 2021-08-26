import * as Router from 'koa-router'
import { Context } from 'koa'
import { catchError, check, generateOk } from '../libs/check'
import { tagKit } from '../kits'

// const router = new Router({
//   prefix: '/api/console/tag',
// })

// router.get('/list', async (ctx: Context) => {
//   try {
//     // let token = ctx.cookies.get('token')
//     // check(!!token)
//     // check(tokenKit.hasToken(token))
//     let rows = await tagKit.list()
//     ctx.body = generateOk(rows)
//   } catch (err) {
//     catchError(err, ctx)
//   }
// })

// router.post('/add', async (ctx: Context) => {
//   try {
//     // let token = ctx.cookies.get('token')
//     // check(!!token)
//     // check(tokenKit.hasToken(token))
//     let { title } = ctx.request.body as { title: string }
//     check(!!title)
//     let res = await tagKit.add(title)
//     ctx.body = generateOk(res)
//   } catch (err) {
//     catchError(err, ctx)
//   }
// })

// router.delete('/:id', async (ctx: Context) => {
//   try {
//     await tagKit.remove(ctx.params.id)
//     ctx.body = generateOk()
//   } catch (err) {
//     catchError(err, ctx)
//   }
// })

// router.put('/:id', async (ctx: Context) => {
//   try {
//     // check data
//     let { title } = ctx.request.body as { title: string }
//     await tagKit.update(ctx.params.id, title)
//     ctx.body = generateOk()
//   } catch (err) {
//     catchError(err, ctx)
//   }
// })

// export default router
