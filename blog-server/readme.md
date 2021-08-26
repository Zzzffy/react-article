## 环境要求

- [NodeJS](http://nodejs.cn/api/)
- [MongoDB](https://www.runoob.com/mongodb/mongodb-tutorial.html)

## 结构说明

```tree
.
├── .gitignore                git忽略配置
├── config.json               服务器配置
├── nodemon.json              nodemon配置
├── package-lock.json
├── package.json              项目配置
├── readme.md                 readme
├── src                       项目主体
│   ├── config.ts             引入配置
│   ├── db.ts                 DB
│   ├── index.ts              入口文件
│   ├── kits                  DB操作
│   │   ├── articles.ts       article文档操作
│   │   ├── file.ts           file文档操作
│   │   ├── index.ts          Kit入口文件
│   │   ├── tags.ts           忽略
│   │   ├── token.ts          token文档操作
│   │   └── users.ts          user文档操作
│   ├── libs                  公共
│   │   ├── check.ts          校验
│   │   ├── contentType.ts    ContentType目录
│   │   ├── exception.ts      错误
│   │   └── upload.ts         忽略
│   ├── route.ts              路由入口
│   ├── routes                子路由
│   │   ├── article.router.ts article路由
│   │   ├── auth.router.ts    认证路由
│   │   ├── file.router.ts    file路由
│   │   ├── tag.router.ts     忽略
│   │   └── user.router.ts    user路由
│   ├── stat.ts               错误集合
│   └── types.ts              类型集合
├── test                      测试脚本
│   ├── article.test.js       article路由测试
│   ├── auth.test.js          auth路由测试
│   ├── user.test.js          user路由测试
│   └── util.js               测试配置导入
└── tsconfig.json             TS配置
```

## 如何运行

1. 启动 mongod     开启mongo
2. npm i          下载环境所需的包
3. npm start      执行编译
4. npm run serve  启动服务

## 如何测试

- 全部测试 npm test
- 单个测试 npx mocha ./test/auth.test.js[测试文件]

## NodeJS Mongo Drive

[如何使用 NodeJS 操作 Mongo？](http://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html#findOne)
