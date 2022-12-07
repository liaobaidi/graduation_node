const jwt = require('jsonwebtoken')
const { scret } = require('../config/index')

module.exports.sign_token = function (data) {
	const token = jwt.sign(data, scret, { expiresIn: 24 * 60 * 60 })
	return token
}

module.exports.verify_token = function (token) {
	try {
		const data = jwt.verify(token, scret)
    console.log('token 验证成功');
		return data
	} catch (err) {
		// token 过期
    console.log('token 过期');
		return false
	}
}
