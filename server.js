const express = require('express')
const { myUse } = require('./plugins/middleware.js')

const app = express()

myUse(app, express)

app.listen(8080, () => {
	console.log(`Welcome to Experiment Management System !`)
	console.table({ author: 'liaobaidi', name: 'Experiment Management System', gitee: 'xxx', github: 'xxx' })
})
