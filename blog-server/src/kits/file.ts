import * as fs from 'fs'
import { Binary, Long } from 'mongodb'
import * as crypto from 'crypto'
import * as db from '../db'
import { check } from '../libs/check'

/**
 * 文件上传，将二进制小文件保存到mongodb数据库中
 * @param req
 * @param name
 * @returns
 */
async function upload(file: string, size: number, name: string) {
  const key = crypto.randomBytes(16).toString('hex')
  const data = await fs.promises.readFile(file)
  await db.fileCollection.insertOne({
    key,
    name,
    data: new Binary(data),
    size,
    createdAt: Long.fromNumber(Date.now()),
  })
  await fs.promises.unlink(file)
  return key
}

/**
 * 查找文件
 * @param key
 * @returns
 */
async function find(key: string) {
  const result = await db.fileCollection.findOne({
    key,
  })
  check(!!result, 'Err_File_Not_Found')
  return result
}

export { find, upload }
