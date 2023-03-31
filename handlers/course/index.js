const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')
const xlsx = require('node-xlsx').default
const multiparty = require('multiparty')
const fs = require('fs')
const path = require('path')

module.exports.my_courseList = function (req, res) {
  console.log('/course/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { account, time, page, pageSize, class_id, course_time, experiment_id, sign_in } = req.body
  connection.query(
    `select c.id, c.course_id, c.course_name, c.teacher_id, c.class_id, d.class_view, u.username, c.time, c.course_time, c.course_view, c.sign_in, c.sign_psw, c.experiment_id, d.class_count from sys_course_list c inner join sys_class_list d on  (c.class_id=d.class_id) inner join sys_user_info u on (c.teacher_id=u.account)`,
    (err, results) => {
      if (err) {
        res.send({
          code: 10001,
          info: null,
          msg: '[SELECT ERROR] - ' + err.message
        })
        return
      }
      let result = results
      if (account) {
        result = result.filter(item => item.teacher_id === account)
      }
      if (time) {
        result = result.filter(item => item.time === time)
      }
      if (+class_id) {
        result = result.filter(item => item.class_id == class_id)
      }
      if (course_time) {
        result = result.filter(item => item.course_time === course_time)
      }
      if (experiment_id) {
        result = result.filter(item => item.experiment_id === experiment_id)
      }
      if (sign_in) {
        result = result.filter(item => item.sign_in)
      }
      const total = result.length
      const maxPage = Math.ceil(total / pageSize)
      let _page = page
      if (_page > maxPage) _page = maxPage
      res.send({
        code: 200,
        info: {
          items: result.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize),
          page: _page,
          pageSize,
          total,
          maxPage
        },
        msg: 'success'
      })
    }
  )
}

module.exports.my_importCourse = function (req, res) {
  console.log('/course/import')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  /* 生成multiparty对象，并配置上传目标路径 */
  let form = new multiparty.Form()
  // 设置编码
  form.encoding = 'utf-8'
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      res.send({ code: 10001, info: null, msg: '上传失败！' })
      return
    }
    const inputFile = files.file[0]
    const newPath = path.join(__dirname, '../../public', 'uploads') + '\\' + inputFile.originalFilename //oldPath  不得作更改，使用默认上传路径就好
    // 同步重命名文件名 fs.renameSync(oldPath, newPath)
    const file_data = fs.readFileSync(inputFile.path)
    fs.writeFileSync(newPath, file_data)
    const list = xlsx.parse(newPath)
    const data = list[0].data
    connection.query(`truncate table sys_course_list`, async err => {
      if (err) throw err
      let sql = ''
      for (let i = 1; i < data.length; i++) {
        sql = `insert into sys_course_list (${data[0][0]}, ${data[0][1]}, ${data[0][2]}, ${data[0][3]}, ${data[0][4]}, ${data[0][5]}, ${data[0][6]}, ${data[0][7]},${data[0][9]}) values ('${data[i][0]}','${data[i][1]}','${data[i][2]}','${data[i][3]}','${data[i][4]}','${data[i][5]}','${data[i][6]}', ${data[i][7]}, '${data[i][9]}');`
        await connection.query(sql)
      }
      res.send({
        code: 200,
        info: true,
        msg: 'success'
      })
    })
  })
}

module.exports.my_signInStart = function (req, res) {
  console.log('/course/signin/start')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_id, time, course_time, class_ids, sign_psw } = req.body
  const class_list = class_ids.split(',')
  const sql = `update sys_course_list set sign_in=1, sign_psw='${sign_psw}' where course_id='${course_id}' and time='${time}' and course_time='${course_time}' and (class_id='${class_list[0]}' or class_id='${class_list[1]}')`
  console.log(sql)
  connection.query(sql, err => {
    if (err) throw err
    res.send({
      code: 200,
      info: true,
      msg: 'success'
    })
  })
}
module.exports.my_signInEnd = function (req, res) {
  console.log('/course/signin/end')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_id, time, course_time, class_ids } = req.body
  const class_list = class_ids.split(',')
  const sql = `update sys_course_list set sign_in=0 where course_id='${course_id}' and time='${time}' and course_time='${course_time}' and class_id='${class_list[0]}' or class_id='${class_list[1]}'`
  connection.query(sql, err => {
    if (err) throw err
    res.send({
      code: 200,
      info: true,
      msg: 'success'
    })
  })
}
module.exports.my_signIn = function (req, res) {
  console.log('/course/signin')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { student_id, course_id, class_id, time, course_time, sign_psw } = req.body
  connection.query(
    `select sign_psw from sys_course_list where class_id='${class_id}' and course_id='${course_id}' and sign_in=1`,
    (err, sign_psws) => {
      if (err) throw err
      if (!sign_psws.length) {
        return res.send({
          code: 10001,
          info: null,
          msg: '签到已结束'
        })
      }
      if (sign_psws[0].sign_psw !== sign_psw) {
        return res.send({
          code: 10001,
          info: null,
          msg: '签到失败'
        })
      } else {
        connection.query(
          `insert into sys_sign_list (student_id, course_id, class_id, time, course_time) values ('${student_id}', '${course_id}', '${class_id}', '${time}', '${course_time}')`,
          err => {
            if (err) throw err
            res.send({
              code: 200,
              info: true,
              msg: 'success'
            })
          }
        )
      }
    }
  )
}
module.exports.my_signInStatus = function (req, res) {
  console.log('/course/signin/status')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_time, time, student_id } = req.body
  connection.query(
    `select * from sys_sign_list where student_id='${student_id}' and time='${time}' and course_time='${course_time}'`,
    (err, results) => {
      if (err) throw err
      if (!results.length) {
        return res.send({
          code: 200,
          info: true,
          msg: '未签到'
        })
      } else {
        return res.send({
          code: 200,
          info: false,
          msg: '已签到'
        })
      }
    }
  )
}

module.exports.my_signInNum = function (req, res) {
  console.log('/course/signin/num')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_id, time, course_time } = req.body
  connection.query(
    `select * from sys_sign_list where course_id='${course_id}' and time='${time}' and course_time='${course_time}'`,
    (err, results) => {
      if (err) throw err
      res.send({
        code: 200,
        info: results.length,
        msg: 'success'
      })
    }
  )
}

module.exports.my_signInCount = function (req, res) {
  console.log('/course/signin/count')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { course_id, class_ids } = req.body
  const class_list = class_ids.split(',')
  connection.query(
    `select distinct c.course_id, c.course_name, l.class_id, l.class_view, u.username, c.time, c.course_view from sys_sign_list s inner join sys_course_list c on (s.course_id=c.course_id) inner join sys_user_info u on (s.student_id=u.account) inner join sys_class_list l on (s.class_id=l.class_id) where c.course_id='${course_id}'`,
    (err, results) => {
      if (err) throw err
      connection.query(`select * from sys_class_list`, (error, result) => {
        if (error) throw error
        const classes = []
        const data = []
        for (let i = 0; i < class_list.length; i++) {
          data.push(...results.filter(item => item.class_id === class_list[i]))
          classes.push(...result.filter(item => item.class_id === class_list[i]))
        }
        const countObj = {}
        for (let i = 0; i < data.length; i++) {
          if (countObj[data[i].time]) {
            countObj[data[i].time]++
          } else {
            countObj[data[i].time] = 1
          }
        }
        const xData = Object.keys(countObj)
        const yData = Object.values(countObj)
        const yMax = classes.reduce((sum, item) => (sum += item.class_count), 0)
        res.send({
          code: 200,
          info: {
            xData,
            yData,
            yMax,
            data
          },
          msg: 'success'
        })
      })
    }
  )
}

module.exports.my_courseForTeacher = function (req, res) {
  console.log('/course/list/teach')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { teacher_id } = req.body
  connection.query(
    `select course_id, course_name from sys_course_list where teacher_id='${teacher_id}'`,
    (err, results) => {
      if (err) throw err
      const courseObj = []
      results.forEach(item => {
        courseObj.push({
          label: item.course_name,
          value: item.course_id
        })
      })
      const map = new Map()
      const unique_course = courseObj.filter(v => !map.has(v.value) && map.set(v.value, 1))
      res.send({
        code: 200,
        info: unique_course,
        msg: 'success'
      })
    }
  )
}

module.exports.my_courseClassList = function (req, res) {
  console.log('/course/class/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  connection.query(`select * from sys_class_list`, (err, results) => {
    if (err) throw err
    const classObj = []
    results.forEach(item => {
      classObj.push({
        label: item.class_view,
        value: item.class_id
      })
    })
    res.send({
      code: 200,
      info: classObj,
      msg: 'success'
    })
  })
}
