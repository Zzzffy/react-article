import * as Router from 'koa-router'
import { Context } from 'koa'
import { catchError, check, generateOk } from '../libs/check'
import { tokenKit, userKit } from '../kits'

const router = new Router({
  prefix: '/api/user',
})
// 更新用户（头像、昵称）
router.put('/updateUserInfo', async (ctx: Context) => {
  try {
    const { avatar, nickname } = ctx.request.body as {
      avatar: string
      nickname: string
    }
    const token = ctx.cookies.get('token')
    let tokenCol = await tokenKit.findOne(token)
    await userKit.updateUserInfo(tokenCol.userId, nickname, avatar)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})
// 更新密码（旧密码、新密码）
router.put('/updatePwd', async (ctx: Context) => {
  try {
    const { oldPwd, newPwd } = ctx.request.body as {
      oldPwd: string
      newPwd: string
    }
    // check data
    const token = ctx.cookies.get('token')
    let tokenCol = await tokenKit.findOne(token)
    await userKit.updatePwd(tokenCol.userId, oldPwd, newPwd)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})
// 获取用户信息
router.get('/userInfo', async (ctx: Context) => {
  try {
    const token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    let user = await userKit.findOne(tokenCol.userId)
    ctx.body = generateOk(user)
  } catch (err) {
    catchError(err, ctx)
  }
})

export default router
