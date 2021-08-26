import { ObjectId } from 'mongodb'
import * as db from '../db'
import { check, Error } from '../libs/check'
import { userKit } from '.'

// 添加用户
async function add(account: string, pwd: string) {
  let user = await userKit.findOneByAccount(account, pwd)
  await removeTokenByUserId(user._id.toString())
  let result = await db.tokenCollection.insertOne({
    userId: user._id.toString(),
  })
  return result.insertedId
}
// 判断token是否存在
async function findOne(id: string) {
  let token = await db.tokenCollection.findOne({
    _id: new ObjectId(id),
  })
  check(!!token, 'Err_Token_Not_Found')
  return token
}
// 删除token
async function removeToken(id: string) {
  let result = await db.tokenCollection.deleteOne({
    _id: new ObjectId(id),
  })
  return result.deletedCount
}
// 更新密码之后需要删除该用户原来的token，登录重新返回一个新token
async function removeTokenByUserId(uid: string) {
  await db.tokenCollection.deleteOne({
    userId: uid,
  })
}

export { add, removeToken, findOne, removeTokenByUserId }
