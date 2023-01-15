const schedule = require('node-schedule')
const connection = require('../../plugins/config')
const dayjs = require('dayjs')

let rule = new schedule.RecurrenceRule()
rule.hour = [0] // 每天0点开始推送
// rule.second = 0 //每分钟的0秒执行

// 启动定时任务
schedule.scheduleJob(rule, () => {
  connection.query(`select * from sys_experiment_list`, (err, results) => {
    if (err) throw err
    const updateArr = []
    for (let i = 0; i < results.length; i++) {
      if (+new Date(results[i].time) < +new Date()) {
        // 小于现在的时间
        results[i].time = dayjs(+new Date() + 48 * 60 * 60 * 1000).format('YYYY-MM-DD')
        results[i].one_two = 50
        results[i].three_four = 50
        results[i].five = 50
        results[i].six_seven = 50
        results[i].eight_nine = 50
        results[i].ten_twi = 50
        updateArr.push(results[i])
      }
    }
    for (let i = 0; i < updateArr.length; i++) {
      connection.query(
        `update sys_experiment_list set one_two=${updateArr[i].one_two}, three_four=${updateArr[i].three_four}, five=${updateArr[i].five}, six_seven=${updateArr[i].six_seven}, eight_nine=${updateArr[i].eight_nine}, ten_twi=${updateArr[i].ten_twi} where ID=${updateArr[i].ID}`
      )
    }
  })
})
