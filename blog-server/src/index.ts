import * as Koa from 'koa'
import router from './route'
import * as db from './db'
import config from './config'
import * as koaBody from 'koa-body'
import * as path from 'path'

const app = new Koa()

app.use(async (ctx, next) => {
  let start = Date.now()
  await next() // 相当于 await function next() { return dispatch(i + 1) }, 而 dispatch(i + 1)就进入了下一个中间件了
  let time = Date.now() - start
  ctx.set('X-Response-Time', time + 'ms')
})
app.use(
  koaBody({ // 代替 koa-bodyparser 和 koa-multer
    multipart: true, // 支持文件上传
    formidable: {
      maxFileSize: config.uploadSizeLimit, // 文件上传大小
      // uploadDir: path.join(__dirname, '../upload/'), // 设置文件上传目录
      // keepExtensions: true,    // 保持文件的后缀
    },
  }),
)
app.use(router.routes())

db.connect().then(() =>
  app.listen(config.port, () => {
    console.log(`start:${config.port}`)
  }),
)
