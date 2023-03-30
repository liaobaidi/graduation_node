const mysql = require('mysql')

const connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '594430',
	port: '3306',
	database: 'db',
	connectionLimit: 1
})

module.exports = connection
