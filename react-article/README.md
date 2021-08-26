# 项目开发准备

## 项目介绍

文章创作平台是一个多用户的文章发布Web应用，用户未登录时可以以游客身份查看文章，但是无法进行发布和编辑文章。用户可以自行注册、登录系统，之后可以修改个人资料，包括昵称、头像以及密码，用户也可以发布、编辑自己的文章。

## 技术选型

- create-react-app
- TypeScript
- React Hooks
- react-router
- axios
- mobx
- CSS Modules
- ant-design
- Markdown

## API接口

老师已经提前写好了服务器代码，根据实际项目需求对老师的代码进行了一些修改，修改如下：

- 用户注册时将昵称和图片字段一起存入了数据库，初始值为空字符串
- 新增根据用户名检查用户是否存在的接口，这样用户在注册时输入用户名之后即可进行校验，不必等输入密码后点登录再检查。
- 用户更新文章时也可以换banner图片

# 启动项目

## 前端

- 安装依赖包：npm i
- 运行：npm start

## 后端

- 安装mongoDB，连接数据库
- 依赖安装：npm i
- 执行编译：npm start      
-  启动服务：npm run serve

# 项目结构

```tree
├── config            	--------------------webpack配置           
├── public          	--------------------出口    
│   ├── favicon.ico  		--------------------浏览器tab上图标
│   ├── index.html  		--------------------项目的入口文件
│   └── manifest.json
├── scripts        		---------------------运行的脚本
│   ├── build.js
│   ├── start.js
│   └── test.js
├── src           		----------------------源码目录
│   ├── assets   		--------------------- 资源目录
│   │   ├── imgs 		--------------------- 图片文件
│   │   └── styles 		--------------------- 全局样式
│   ├── components   	-------------------公共组件
│   │   ├── Article  	-----------------文章列表组件
│   │   │   ├── ArticleItem  	-----------------每篇文章组件
│   │   ├── AuthRoute   		-------------------路由鉴权组件
│   │   ├── BackToTop  			--------------------回到顶部组件
│   │   ├── Nav  				--------------------顶部导航栏组件
│   │   │   └── SlideMenu  		-----------------点击头像侧边导航组件
│   ├── pages       	--------------------页面目录
│   │   ├── Index    		--------------------首页
│   │   ├── Detail   		---------------------文章详情页面
│   │   ├── Login  			---------------------登录页面
│   │   ├── Register  		---------------------注册页面
│   │   ├── Person  		---------------------个人主页
│   │   │   ├── Set  		----------------- 修改资料
│   │   ├── Writer 			-------------------- 写文章页面
│   │   └── NotFound 		-------------------404页面
│   ├── routes  	 	----------------------- 路由
│   │   ├── publicRoutes.ts  	--------------------公共路由
│   │   └── privateRoutes.ts  	--------------------私有路由
│   ├── services       	----------------------API目录
│   │   └── api.ts
│   ├── store   		------------------------mobx状态管理目录
│   │   ├── UserStore.ts  	--------------------用户相关
│   │   ├── ArticleStore.ts --------------------文章相关
│   │   └── storage.ts  	--------------------浏览器持久化存储
│   └── utils  			------------------------ 公用方法
│   │   ├── blobToBase64.ts --------------将图片转化为base64
│   │   ├── time.ts  		-----------------对时间进行处理
│   │   └── cookie.ts  		---------------对cookie操作
│   ├── index.tsx    --------------------入口
│   ├── App.tsx    	--------------------index.js引用
│   ├── react-app-env.d.ts    --------------------自动生成的类型声明文件
│   ├── types.ts    --------------------数据类型接口文件
├── .gitignore    ----------------- git忽略配置
├── config-overrides.js        -----------------配置antd按需加载文件
├── package.json              ---------------- 项目配置信息
├── tsconfig.json        -----------------ts相关配置
├── README.md      ----------------------README
├── yarn.lock      ----------------------锁定项目所需的各种配置版本
```

# 项目思路

## 引入antd

```
1、下载antd：yarn add antd
2、按需引入: 参考官网步骤
    下载工具包 yarn add react-app-rewired customize-cra
    创建 config-overrides.js
    修改 package.json
3、使用antd的组件
    根据antd的文档编写
```

## 引入路由

```
1、下载包: react-router-dom
2、使用路由懒加载
3、拆分应用路由:
  所有用户可以访问的页面：首页、文章详情页
  只有登录用户才能访问的页面：写文章、个人主页
4、注册路由:
  <BrowserRouter>
  <Switch>
  <Route path='' component={}/>
```

## 引入axios

```
1、安装 npm i axios
2、封装接口请求函数: services/api.ts，使用async/await，外部的调用得到的直接是数据
3、解决axios跨域请求问题(开发时)
    办法: 配置代理  ==> 只能解决开发环境
    编码: package.json: proxy: "http://localhost:3000"
```

## 登录

```
1、自定义一部分样式布局
2、使用antd的组件实现登陆表单界面：Form、Form.Item、 Input、Button、Avatar
3、表单数据验证：
	得到form对象：const [form] = Form.useForm();
	操作数据：form.setFieldsValue() 设置表单数据的值，用于实现记住我功能
			通过Form表单的onFinish函数参数values可以得到所有表单项数据值
	数据验证：给Form.Item设置rules属性进行输入限制
4、调用登录接口
	如果成功，将token值保存到cookie中（由于无法对服务器设置的cookie进行操作，因此需要手动创建一个cookie），如果用户点击了记住我，那么还需要将用户账号和密码存入localStorage中，通过调用mobx方法进行存储。之后跳转到先前页面，默认值为首页。
	如果失败, 显示错误提示信息。
5、记住我功能
	结合localstorage实现
6、加载用户头像
	用户输入用户名，发起请求，根据返回数据得到avatar，再调用api获取用户头像进行展示，若avatar为空则展示默认头像。
```

### 遇到的问题：

- 在实现记住我的功能时，不知道应该把用户信息保存到cookie还是storage，考虑到每次请求都会携带cookie信息，所以就将它保存到了localstorage中。

- react router 登录成功后应该返回之前用户浏览的页面，而并非固定为首页

  - 找到来源页中跳转登录按钮，将本页pathname存放到路由state中

  ```
  <Link to={{
      pathname: "/sign_in",
      state: { from: location.pathname }
  }}>
  ```

  - 跳转到登录页面后，获取来源，登录完成后页面重定向至来源页面（判断是否有来源页面，若用户直接进入的是登录页面，则无法获取state，此时应提供一个默认首页供用户跳转）

  ```
  // 发送登录请求
   if (result.stat === 'ok') {
    // from 保存跳转到登录页前的页面路径，用于在登录成功后重定向到原来页面
    // 如果用户直接进入登录页面 state为undefined，因此提供一个默认值
    const { from } = props.location.state || { from: { pathname: '/' } };
    history.push(from)
  }
  ```

- 如何在页面加载时给Form 的Input框赋值？

  - 使用 `form.setFieldsValue` 可以实现页面控件的赋值加载

## 注册

```
1、注册功能和登录类似，表单的数据校验是最重要的部分
	用户名：必填，2-10位以字母开头，可带数字下划线
	密码：必填，只能输入6-12个字母、数字、下划线
	确认密码：使用antd自带的hasFeedback校验两次密码是否相同
2、注册输入用户名时，发请求判断用户是否存在，显示相应提示信息。注册成功跳到登录页面。
```

## 首页

### 导航栏

```
1、左侧logo：点击logo图标回到首页
2、中间搜索框：使用antd的Search搜索组件
3、右侧：根据是否登录进行展示，未登录显示登录注册写文章，登录显示用户头像和写文章，头像有下拉列表。
	登录之后用户默认没有头像，需要设置一个默认值，设置onError返回值为true，会显示icon内容
	<Avatar src={img} icon={<UserOutlined />} onError={() => true} />
```

#### 遇到的问题：

- 用户是否登录决定导航栏显示什么，应该在哪个组件判断用户是否登录呢？又依据什么来判断是否登录？逻辑不是很清晰
  - 用户登录之后，将token保存到了cookie中，因此可以根据cookie来判断用户是否登录。在react中使用cookie使用到了react-cookies包，需要安装后进行使用 `npm install --save @types/react-cookies react-cookies`
  - 在导航栏组件判断是否登录，如果登录了，立即发请求获取用户信息保存到mobx中并获取用户头像进行展示。
- mobx中的数据刷新页面后会丢失？
  - 将mobx与localstorage结合实现持久化存储，这样就不会丢失用户信息了。
- 导航栏的keyword关键字如何传给文章列表组件？
  - 导航栏输入的keyword需要保存到mobx中，然后在文章组件获取keyword，发起网络请求获取文章列表数据

### 排序

```
1、分为最新和最热，通过NavLink进行跳转，然后在文章列表组件根据路径不同分别获取文章列表数据。发请求需要获取mobx中的keyword关键字，当页码、每页条数、关键字变化就需要重新发请求获取数据。
	路径为'/user'：获取用户所有文章列表
	路径为'/'：获取所有文章列表，默认按时间排序
	其他情况：获取所有文章列表，按浏览量排序
2、当子组件ArticleItem删除文章时，父组件需要重新获取数据，用到子传父
```

### 文章列表

```
1、文章列表组件需要根据不同路径获取数据，将获取到的数据通过map循环将每一项文章数据传给子组件ArticleItem
2、如果是用户所有文章列表，需要阻止点击每一篇文章默认跳转事件，因为用户除了可以查看自己写的文章，还可以编辑、删除文章，因此在该页面单独增加一个浏览的NavLink用来查看文章详情。
```

## 搜索

```
1、使用Antd的Search组件，输入关键字后需要保存到mobx中传给Article组件。
2、使用分页搜索，底部分页显示英文，需要对antd全局配置显示中文，在App.ts文件：locale={zhCN}
```

#### 遇到的问题：

- 如果不是在第一页搜索，需要进行判断，判断总条数与页码以及每页条数之间的关系，判断得到的结果是否应该回到第一页展示

  ```
  if ((pageIndex - 1) * pageSize >= result.data.total) {
     setPageIndex(1)
  }
  ```

## 个人中心

### 修改昵称头像

```
1、一进入页面就需要将store中的用户信息赋值给Form表单项
2、用户名不可更改，昵称和头像可选，昵称有字段限制，头像也有大小限制。
```

#### 遇到的问题：

- 修改了头像之后，回到个人中心时头像并没有发生改变，mobx数据没有变化
  - MobX 追踪属性访问，而不是值，MobX观察属性的引用是否发生变化。对于本例来说，Mobx目前监听了user，那么user下的属性avatar，account等等都会被监听到，因此当修改了用户头像之后，需要调用store中的使用action的setAvatar方法，将新的key传过去，然后在该方法中更改user.avatar的值，再调用setVal方法持久化保存，这样刷新页面也可以获取数据。
- 修改头像之后，如果用户想删除该头像，恢复默认呢？
  - 添加一个按钮，用户点击后调用setImageUrl('')、store.setAvatar('')重置头像。
- 如果只修改昵称，不修改头像会出现bug
  - 给图片绑定的属性有错误，应该始终为imageUrl。
- 根据key值获取头像时，需要将返回的数据转换成base64（utils/blobToBase64.ts）然后赋给src属性即可显示。

```js
// 根据 key获取图片
export async function getAvatar(key: string) {
  let result: any = await axios.get('/api/file/preview/' + key, { responseType: 'blob' }
  )
  return blobToBase64(result.data)
}
```

### 修改密码

```
1、密码只能输入6-12个字母、数字、下划线
2、新密码与原密码不能相同，确认密码必须和新密码一致，使用antd的hasFeedback，并设置dependencies={['']}
3、修改成功后：删除mobx中原来的用户信息、删除登录信息、删除cookie，跳转到登录页面重新登录
```

## 文章

文章采用markdown格式进行编辑，支持插入代码块并且渲染的时候支持代码高亮，编辑器采用bytemd，支持图片上传。

### 添加文章

文章标题必填，长度不超过56个字符，副标题必填，长度不超过20，标签（不超过三个）和文章封面（一张）为可选项。

### 编辑文章

根据路径判断是否有文章id，如果有则表示是编辑页面，更改对应文字信息，发请求获取文章详情渲染到markdown中。

#### 遇到的问题：

- 使用markdown自带上传图片功能时，需要调用api获取图片的key值（之前上传头像可以直接把后端图片接口写在action中），编写upload函数用来上传图片，注意文件上传需要用 multipart/form-data，原因可见https://zhuanlan.zhihu.com/p/120834588，之前上传头像也可以发现请求头数据类型也是form-data，而在markdown里面上传图片默认格式并非这种，所以需要在upload函数里对传过来的File类型数据进行转换。

```js
export async function upload(File: any) {
  let data = new FormData();
  data.append('file', File[0]);
  let result: any = await axios.post('/api/file/upload/', data
  )
  return result.data
}
```

- 得到key值之后，想要在右侧显示上传的图片，不需要再特地发起请求！（与上传头像不同）直接将key值返回到uploadImages，对url进行拼接`/api/file/preview/${key}`，markdown会自动发起网络请求展示图片。

- markdown的Viewer模式下，显示高亮样式等需要下载包 https://github.com/sindresorhus/github-markdown-css

  然后在需要使用Viewer的地方引入样式文件，全局设置样式 https://blog.csdn.net/tangkthh/article/details/102756014

### 文章详情

使用bytemd的View模式，将文章内容赋给value，同样引入样式文件设置样式进行展示。

如果是用户自己写的文章，添加一个编辑文章按钮，提升用户体验感。

#### 遇到的问题：

- 一进入页面时，banner图未获取到，无法显示
  - 给Card组件设置loading属性，初始值为true表示还在加载，此时不会展示内容。在useEffect中根据对比loading状态获取banner图片。
- 右侧展示markdown目录使用了`markdown-navbar`组件 https://www.jianshu.com/p/77b4bef87b89

# 项目总结

历时两周，终于完成了结营作业，也算是为我的暑期实习画上了圆满的句号。本次作业虽然完成了老师要求的基本功能，但是仍有不足之处，本来还想实现标签通过接口获取，搜索功能做得更全面一些，可以按照用户名、文章关键字、标签进行搜索，还有用户可以查看其它用户主页等等这些功能，由于时间和能力因素，这次没能实现。在完成作业的过程中，自我感觉能力得到了很大的提升，能够将培训期间学到的知识运用到实际项目，最终实现属于自己的文章创作平台，内心是非常骄傲和开心的，在做项目过程中遇到了许多问题，通过百度、查文档，最终都一一解决了，学习能力和解决问题能力也得到了提高。最后，感谢金山给我提供了宝贵的学习机会，感谢老师这两个月来对我们的教学和督促，最后也感谢自己这两周的付出，完美收官，继续加油！！！