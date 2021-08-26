import { inspect } from 'util'
import * as path from 'path'
import * as fs from 'fs'
import Busboy from 'busboy'
import { Context } from 'vm'
/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
export function mkdirsSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
    return false
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName: string) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

interface Result {
  message: string
  formData: any
  success: boolean
  fileName: string
}
/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}
 */
export function uploadFile(ctx: Context, options: any) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({ headers: req.headers })

  // 获取类型
  let fileType = options.fileType || 'common'
  let filePath = path.join(options.path, fileType)
  let mkdirResult = mkdirsSync(filePath)

  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result: Result = {
      success: false,
      formData: {},
      fileName: '',
      message: '',
    }

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      let fileName =
        Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
      let _uploadFilePath = path.join(filePath, fileName)
      let saveTo = path.join(_uploadFilePath)

      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo))

      // 文件写入事件结束
      file.on('end', function () {
        result.success = true
        result.message = '文件上传成功'
        result.fileName = fileName
        console.log('文件上传成功！')
        resolve(result)
      })
    })

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname: string, val: any) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val))
      result.formData[fieldname] = inspect(val)
    })

    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上传结束')
      resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上传出错')
      reject(result)
    })

    req.pipe(busboy)
  })
}
