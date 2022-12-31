const cors = require('cors')
const { createRouter } = require('../router')
const { verify } = require('../handlers/sys')
const res = require('express/lib/response')
// 中间件列表
module.exports.myUse = function (app, express) {
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
