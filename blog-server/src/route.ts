import * as Router from 'koa-router'
import articleRoute from './routes/article.router'
import authRoute from './routes/auth.router'
import userRoute from './routes/user.router'
import fileRoute from "./routes/file.router"

// 配置路由
const router = new Router()
router.use(articleRoute.routes())
router.use(authRoute.routes())
router.use(userRoute.routes())
router.use(fileRoute.routes())

export default router
