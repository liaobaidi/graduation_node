const connection = require('../../plugins/config')
module.exports.my_userlist = function (req, res) {
	const { page, pageSize } = req.body
	connection.query(`select id, username, account, class_id from sys_user_liao`, (err, result) => {
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
		const results = result.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
		res.send({
			code: 200,
			info: {
				items: results,
				page,
				pageSize,
				total,
				maxPage
			},
			msg: 'success'
		})
	})
}
