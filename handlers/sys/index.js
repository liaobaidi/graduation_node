const connection = require('../../plugins/config')
const { sign_token } = require('../../utils/token')
module.exports.my_login = function (req, res) {
	console.log('/sys/login')
	const { account, psw } = req.body
	const sql = `select username, account, psw, identity from sys_user_liao`
	connection.query(sql, (err, result) => {
		if (err) {
			res.send({
				code: 10001,
				info: null,
				msg: '[SELECT ERROR] - ' + err.message
			})
			return
		}
		for (let i = 0; i < result.length; i++) {
			if (result[i].account === account && result[i].psw === psw) {
				const token = sign_token({ identity: result[i].identity })
				return res.send({
					code: 200,
					info: {
						userInfo: {
							username: result[i].username,
							identity: result[i].identity
						},
						token
					},
					msg: 'success'
				})
			}
			if (i === result.length - 1) {
				return res.send({
					code: 10001,
					info: null,
					msg: '账号或密码错误'
				})
			}
		}
		return
	})
}

module.exports.my_update = function (req, res) {
	res.send({
		code: 200,
		info: 'update',
		msg: 'success'
	})
}

module.exports.my_logout = function (req, res) {
	res.send({
		code: 200,
		info: true,
		msg: 'success'
	})
}
