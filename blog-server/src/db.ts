import { MongoClient, Collection, WithId } from 'mongodb'

import config from './config'
import {  ITag,IArticle, IUser, IToken, IFile } from './types'

let client: MongoClient
export let articleCollection: Collection<WithId<IArticle>>
export let tagCollection: Collection<WithId<ITag>>
export let userCollection: Collection<WithId<IUser>>
export let tokenCollection: Collection<WithId<IToken>>
export let fileCollection: Collection<WithId<IFile>>

export async function connect() {
  client = await MongoClient.connect(`mongodb://${config.mongo_host}`)
  let db = client.db(config.mongo_db)
  articleCollection = db.collection('articles')
  tagCollection = db.collection('tags')
  userCollection = db.collection('users')
  tokenCollection = db.collection('tokens')
  fileCollection = db.collection('files')
}
