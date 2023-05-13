const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')
const xlsx = require('node-xlsx').default
const multiparty = require('multiparty')
const fs = require('fs')
const path = require('path')

module.exports.my_terminalCount = function (req, res) {
  console.log('/terminal/count/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { class_id, course_id, page, pageSize } = req.body
  // 获取columns
  connection.query(
    `select title from sys_homework_list where class_id='${class_id}' and course_id='${course_id}' order by date asc`,
    (err, titles) => {
      if (err) throw err
      const columns = [{ label: '姓名', align: 'center', prop: 'username' }]
      titles.forEach(item => {
        columns.push({
          label: item.title,
          align: 'center',
          prop: item.title
        })
      })
      columns.push(
        {
          label: '作业均分',
          align: 'center',
          prop: 'homework_mid'
        },
        {
          label: '出勤率',
          align: 'center',
          prop: 'work_rate'
        },
        {
          label: '期末评分',
          align: 'center',
          prop: 'action'
        }
      )
      // console.log('columns: ', columns)
      // 获取具体成绩信息
      const sql = `select u.account, u.username, u.class_id, h.title, d.score, h.course_id from sys_done_list d inner join sys_user_info u on (d.account=u.account) inner join sys_homework_list h on (d.homework_id=h.id) where h.course_id='${course_id}' and u.class_id='${class_id}'`
      connection.query(sql, (err1, results) => {
        if (err1) throw err1
        const _data = []
        const data = []
        results.forEach(item => {
          _data.push({
            account: item.account,
            username: item.username,
            [item.title]: item.score,
            course_id: item.course_id,
            class_id: item.class_id
          })
        })
        if (_data.length) data.push(_data[0])

        _data.forEach(item => {
          const index = data.findIndex(it => it.account === item.account)
          if (index !== -1) {
            data[index] = Object.assign(data[index], item)
          } else {
            data.push(item)
          }
        })
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          const keys = Object.keys(data[i])
          let sum = 0
          for (let j = 0; j < keys.length; j++) {
            if (titles.map(it => it.title).includes(keys[j])) {
              sum += +data[i][keys[j]]
            }
          }
          data[i].homework_mid = (sum / titles.length).toFixed(2)
        }
        // 获取出勤数据
        const sql2 = `select count(*) from sys_course_list where course_id='${course_id}' and class_id='${class_id}'`
        connection.query(sql2, (err2, counts) => {
          if (err2) throw err2
          const course_sum = counts[0]['count(*)']
          // 获取签到次数
          const sql3 = `select * from sys_sign_list where course_id='${course_id}' and class_id='${class_id}'`
          connection.query(sql3, (err3, signs) => {
            if (err3) throw err3
            const signObj = {}
            // 统计每一个学生的出勤次数
            signs.forEach(item => {
              if (signObj[item.student_id]) {
                signObj[item.student_id]++
              } else {
                signObj[item.student_id] = 1
              }
            })
            const accounts = Object.keys(signObj)
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < accounts.length; j++) {
                if (data[i].account === accounts[j]) {
                  data[i].work_rate = (signObj[accounts[j]] / course_sum).toFixed(4)
                }
              }
            }
            // 防止有人什么都没做
            connection.query(
              `select account, username, class_id from sys_user_info where class_id='${class_id}'`,
              (err4, stus) => {
                if (err4) throw err4
                for (let i = 0; i < stus.length; i++) {
                  if (data.findIndex(item => item.account === stus[i].account) === -1) {
                    data.push({
                      account: stus[i].account,
                      username: stus[i].username,
                      course_id,
                      homework_mid: 0,
                      work_rate: 0,
                      class_id: stus[i].class_id
                    })
                  }
                }
                const total = data.length
                const maxPage = Math.ceil(total / pageSize)
                let _page = page
                if (_page > maxPage) _page = maxPage
                res.send({
                  code: 200,
                  info: {
                    columns,
                    data: data.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize)
                  }
                })
              }
            )
          })
        })
      })
    }
  )
}

module.exports.my_terminalGrade = function (req, res) {
  console.log('/terminal/count/grade')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { account, course_id, score, class_id, id } = req.body
  if (!id) {
    const sql = `insert into sys_grade_list (student_id, course_id, class_id, score) values ('${account}', '${course_id}', '${class_id}', ${score})`
    connection.query(sql, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: 'success'
      })
    })
  } else {
    const sql = `update sys_grade_list set student_id='${account}', course_id='${course_id}', score=${score}, class_id='${class_id}' where id=${id}`
    connection.query(sql, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: 'success'
      })
    })
  }
}

module.exports.my_terminalGradeCount = function (req, res) {
  console.log('/terminal/count')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_id, class_list, page, pageSize } = req.body
  const sql = `select g.id, o.class_id, o.class_count, o.class_view, u.account, u.username, c.course_name, g.score from sys_grade_list g inner join sys_user_info u on (g.student_id=u.account) inner join sys_course_list c on (g.course_id=c.course_id and g.class_id=c.class_id) inner join sys_class_list o on (g.class_id=o.class_id) where g.course_id='${course_id}'`
  connection.query(sql, (err, results) => {
    if (err) throw err
    const data = []
    for (let i = 0; i < class_list.length; i++) {
      data.push(...results.filter(item => item.class_id === class_list[i]))
    }
    const total = data.length
    const maxPage = Math.ceil(total / pageSize)
    let _page = page
    if (_page > maxPage) _page = maxPage
    res.send({
      code: 200,
      info: {
        items: data.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize),
        page: _page,
        pageSize,
        total,
        maxPage
      },
      msg: 'success'
    })
  })
}

module.exports.my_getTerminalGrade = function (req, res) {
  console.log('/terminal/count/stu')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const student_id = data.account
  const sql = `select distinct u.account, u.username, c.class_view, g.score, o.course_name from sys_grade_list g inner join sys_user_info u on (g.student_id=u.account) inner join sys_class_list c on (g.class_id=c.class_id) inner join sys_course_list o on (o.class_id=c.class_id and o.class_id=u.class_id and g.course_id=o.course_id) where g.student_id='${student_id}'`
  connection.query(sql, (err, results) => {
    if (err) throw err
    res.send({
      code: 200,
      info: results,
      msg: 'success'
    })
  })
}
