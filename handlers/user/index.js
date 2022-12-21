const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')
module.exports.my_userlist = function (req, res) {
	console.log('/user/list')
	const { authorization } = req.headers
	const data = verify_token(authorization)
	if (!data) {
		return res.send({
			code: 401,
			info: null,
			msg: 'token失效'
		})
	}
	if (data.identity !== 'admin') {
		return res.send({
			code: 404,
			info: null,
			msg: '没有权限'
		})
	}
	const { page, pageSize, account } = req.body
	let sql = 'select id, username, account, class_id, identity from sys_user_liao'
	if(account) sql = sql + ' where account='+account
	connection.query(sql, (err, result) => {
		if (err) {
			res.send({
				code: 10001,
				info: null,
				msg: '[SELECT ERROR] - ' + err.message
			})
			return
		}
		const total = result.length
		const maxPage = Math.ceil(total / pageSize)
		let _page = page
		if(_page > maxPage) _page = maxPage
		const results = result.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize)
		res.send({
			code: 200,
			info: {
				items: results,
				page: _page,
				pageSize,
				total,
				maxPage
			},
			msg: 'success'
		})
	})
}
