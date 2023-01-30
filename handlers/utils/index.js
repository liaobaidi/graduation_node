const path = require('path')
const multiparty = require('multiparty')
const fs = require('fs')
const { verify_token } = require('../../utils/token')
const getLocalIP = require('../../utils/getIp')

module.exports.uploadFile = function (req, res) {
  console.log('/upload/image')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  /* 生成multiparty对象，并配置上传目标路径 */
  let form = new multiparty.Form()
  // 设置编码
  form.encoding = 'utf-8'
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      res.send({ code: 10001, info: null, msg: '上传失败！' })
      return
    }
    const inputFile = files.file[0]
    const newPath = path.join(__dirname, '../../public', 'images') + '\\' + inputFile.originalFilename //oldPath  不得作更改，使用默认上传路径就好
    // 同步重命名文件名 fs.renameSync(oldPath, newPath)
    const file_data = fs.readFileSync(inputFile.path)
    fs.writeFileSync(newPath, file_data)
    const ip = getLocalIP()
    res.send({
      code: 200,
      info: {
        url: ip + '/images/' + inputFile.originalFilename
      },
      msg: '上传成功!'
    })
  })
}

module.exports.uploadProtocol = function (req, res) {
  console.log('/upload/protocol')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  /* 生成multiparty对象，并配置上传目标路径 */
  let form = new multiparty.Form()
  // 设置编码
  form.encoding = 'utf-8'
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      res.send({ code: 10001, info: null, msg: '上传失败！' })
      return
    }
    const inputFile = files.file[0]
    console.log(inputFile.path);
    const newPath = path.join(__dirname, '../../public', 'protocol') + '\\' + inputFile.originalFilename //oldPath  不得作更改，使用默认上传路径就好
    // 同步重命名文件名 fs.renameSync(oldPath, newPath)
    const file_data = fs.readFileSync(inputFile.path)
    fs.writeFileSync(newPath, file_data)
    const ip = getLocalIP()
    res.send({
      code: 200,
      info: {
        url: ip + '/protocol/' + inputFile.originalFilename
      },
      msg: '上传成功!'
    })
  })
}

module.exports.uploadVideo = function (req, res) {
  console.log('/upload/video')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  /* 生成multiparty对象，并配置上传目标路径 */
  let form = new multiparty.Form()
  // 设置编码
  form.encoding = 'utf-8'
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      res.send({ code: 10001, info: null, msg: '上传失败！' })
      return
    }
    const inputFile = files.file[0]
    console.log(inputFile.path);
    const newPath = path.join(__dirname, '../../public', 'videos') + '\\' + inputFile.originalFilename //oldPath  不得作更改，使用默认上传路径就好
    // 同步重命名文件名 fs.renameSync(oldPath, newPath)
    const file_data = fs.readFileSync(inputFile.path)
    fs.writeFileSync(newPath, file_data)
    const ip = getLocalIP()
    res.send({
      code: 200,
      info: {
        url: ip + '/videos/' + inputFile.originalFilename
      },
      msg: '上传成功!'
    })
  })
}
