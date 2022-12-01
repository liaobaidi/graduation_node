module.exports.my_login = function (req, res) {
	res.send({
		code: 200,
		info: 'login',
		msg: 'success'
	})
}

module.exports.my_update = function (req, res) {
	res.send({
		code: 200,
		info: 'update',
		msg: 'success'
	})
}