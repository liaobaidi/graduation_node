const { my_login, my_logout } = require('../handlers/sys')
const { my_userlist } = require('../handlers/user')

module.exports.createRouter = function (app, express) {
	const router = express.Router()

	/**
	 * 登录
	 */
	router.post('/sys/login', (req, res) => my_login(req, res))

	/**
	 * 修改密码
	 */
	router.post('/sys/update', (req, res) => my_update(req, res))

	/**
	 * 用户列表
	 */
	router.post('/user/list', (req, res) => my_userlist(req, res))

	/**
	 * 登出
	 */
	router.post('/user/logout', (req, res) => my_logout(req, res))

	return router
}
