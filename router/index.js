const { my_login } = require('../handlers/sys')
module.exports.createRouter = function (app, express) {
	const router = express.Router()

	/**
	 * 登录
	 */
	router.post('/login', (req, res) => my_login(req, res))


  /**
	 * 修改密码
	 */
	router.post('/update', (req, res) => my_update(req, res))

	return router
}
