const cors = require('cors')
const { createRouter } = require('../router')
// 中间件列表
module.exports.myUse = function (app, express) {
  app.all('*', function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*')
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Accept,Content-type')
    res.header('Access-Control-Allow-Credentials', true)
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    // res.header('Content-Type', 'application/json;charset=utf-8')
    if (req.method.toLowerCase() == 'options') res.sendStatus(200)
    //让options尝试请求快速结束
    else next()
  })

  // cors跨域处理
  app.use(cors())

  // 静态资源开放
  app.use(express.static('public'))

  // 参数解析
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // 注册路由
  app.use(createRouter(app, express))
}
