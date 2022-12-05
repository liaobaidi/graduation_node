const connection = require('../../plugins/config')
module.exports.my_userlist = function (req, res) {
	connection.query(`select * from sys_user_liao`, (err, result) => {
		if (err) {
			res.send({
				code: 10001,
				info: null,
				msg: '[SELECT ERROR] - ' + err.message
			})
			return
		}
		res.send({
			code: 200,
			info: result,
			msg: 'success'
		})
	})
}
