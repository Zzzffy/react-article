import { ObjectId } from 'mongodb'
import * as db from '../db'
import { Status } from '../types'
import { check, Error } from '../libs/check'
async function add(title: string) {
  let tag = await db.tagCollection.findOne({
    title,
  })
  check(!!!tag, 'Err_Tag_Exist')
  let result = await db.tagCollection.insertOne({
    title,
    status: 0,
    ctime: new Date().getTime(),
  })
  return result.insertedId
}

async function findOne(id: string) {
  let tag = await db.tagCollection.findOne({
    _id: new ObjectId(id),
    status: Status.normal,
  })
  check(!!tag, 'Err_Tag_Not_Found')
  return tag
}

async function remove(id: string) {
  let result = await db.tagCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { status: Status.delete },
    },
  )
  check(!!result, 'Err_Tag_Not_Found')
}

function list() {
  return db.tagCollection.find({ status: Status.normal }).toArray()
}

async function update(id: string, title: string) {
  let tag = await findOne(id)
  tag.title = title
  let result = await db.tagCollection.findOneAndUpdate(
    { _id: new ObjectId(id), status: Status.normal },
    {
      $set: tag,
    },
  )
  check(!!result, 'Err_Tag_Not_Found')
}

export { list, add, update, remove, findOne }
