const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '594430',
	port: '3306',
	database: 'db',
})

connection.connect()

module.exports = connection
