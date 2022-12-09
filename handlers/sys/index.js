const connection = require('../../plugins/config')
const { sign_token, verify_token } = require('../../utils/token')
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
				const token = sign_token({ identity: result[i].identity, account: result[i].account })
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
	const { authorization } = req.headers
	const data = verify_token(authorization)
	if (!data) {
		return res.send({
			code: 401,
			info: null,
			msg: 'token失效'
		})
	}
	const account = data.account
	const { psw, newPsw } = req.body
	connection.query(`select account, psw from sys_user_liao`, (err, result) => {
		if (err) {
			res.send({
				code: 10001,
				info: null,
				msg: '[SELECT ERROR] - ' + err.message
			})
			return
		}
		const flag = result.some((item) => {
			if (item.account === account) {
				if (item.psw !== psw) {
					// 密码错误
					return false
				} else {
					return true
				}
			}
		})
		if (!flag) {
			return res.send({
				code: 10001,
				info: null,
				msg: '密码错误！'
			})
		}
		connection.query(`update sys_user_liao set psw='${newPsw}' where account='${account}'`, (err, result) => {
			return res.send({
				code: 200,
				info: true,
				msg: '修改成功！'
			})
		})
	})
}

module.exports.my_logout = function (req, res) {
	console.log('/sys/logout')
	res.send({
		code: 200,
		info: true,
		msg: 'success'
	})
}
