const express = require('express')
const { myUse } = require('./plugins/middleware.js')

// 定时任务
require('./handlers/timer')

// 健康监听
require('./plugins/watch.js')

const app = express()

myUse(app, express)

app.listen(8080, () => {
  console.log(`Welcome to Experiment Management System !`)
  console.table({
    author: 'liaobaidi',
    name: 'Experiment Management System',
    gitee: 'https://gitee.com/liaobaidi/graduation_node',
    github: 'https://github.com/liaobaidi/graduation_node'
  })
})
