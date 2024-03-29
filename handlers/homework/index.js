const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')

module.exports.my_homeworkList = function (req, res) {
  console.log('/homework/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, class_id } = req.body
  let sql = ''
  if (data.identity === 'teacher') {
    sql = `select distinct h.id, h.title, h.info, h.date, h.protocol, c.class_view, u.username, d.course_name from sys_homework_list h inner join sys_class_list c on (h.class_id=c.class_id) inner join sys_user_liao u on (h.author_id=u.account) inner join sys_course_list d on (h.course_id=d.course_id) where u.account='${
      data.account
    }' ${class_id ? 'and h.class_id=' + class_id : ''} order by h.date asc`
  } else if (data.identity === 'admin') {
    sql = `select distinct h.id, h.title, h.info, h.date, h.protocol, c.class_view, u.username, d.course_name from sys_homework_list h inner join sys_class_list c on (h.class_id=c.class_id) inner join sys_user_liao u on (h.author_id=u.account) inner join sys_course_list d on (h.course_id=d.course_id) ${
      class_id ? 'where h.class_id=' + class_id : ''
    } order by h.date asc`
  } else {
    sql = `select distinct h.id, h.title, h.info, h.date, h.protocol, c.class_view, u.username, d.course_name from sys_homework_list h inner join sys_class_list c on (h.class_id=c.class_id) inner join sys_user_liao u on (h.author_id=u.account) inner join sys_course_list d on (h.course_id=d.course_id) where h.class_id=${class_id} order by h.date asc`
  }
  connection.query(sql, (err, result) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    const total = result.length
    const maxPage = Math.ceil(total / pageSize)
    let _page = page
    if (_page > maxPage) _page = maxPage
    const results = result.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize)
    res.send({
      code: 200,
      info: {
        items: results,
        page: _page,
        pageSize,
        total,
        maxPage
      },
      msg: 'success'
    })
  })
}

module.exports.my_homeworkSaveOrUpdate = function (req, res) {
  console.log('/homework/saveOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, title, info, protocol, class_id, account, date, course_id } = req.body
  if (id) {
    // 修改作业
    const sql = `update sys_homework_list set author_id='${account}', title='${title}', info='${info}', protocol='${protocol}', class_id=${class_id}, date='${date}', course_id='${course_id}' where  id=${id}`
    connection.query(sql, err => {
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
        info: true,
        msg: '修改成功！'
      })
    })
  } else {
    // 发布作业
    connection.query(`select id from sys_homework_list`, (err, ids) => {
      if (err) throw err
      const nextId = ids.length ? ids[ids.length - 1].id + 1 : 1000
      const sql = `insert into sys_homework_list (id, title, info, protocol, class_id, author_id, date, course_id) values (${nextId}, '${title}', '${info}', '${protocol}', ${class_id}, '${account}', '${date}', '${course_id}')`
      connection.query(sql, error => {
        if (error) {
          res.send({
            code: 10001,
            info: null,
            msg: '[SELECT ERROR] - ' + error.message
          })
          return
        }
        res.send({
          code: 200,
          info: true,
          msg: '发布成功！'
        })
      })
    })
  }
}

module.exports.my_homeworkCheck = function (req, res) {
  console.log('/homework/check')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, score, desc } = req.body
  connection.query(`update sys_done_list set status=2, score='${score}', \`desc\`='${desc}' where id=${id}`, err => {
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
      info: true,
      msg: '批改成功！'
    })
  })
}

module.exports.my_homeworkCommit = function (req, res) {
  console.log('/homework/commit')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { homework_id, class_id, account, protocol, type } = req.body
  connection.query(`select id from sys_done_list`, (err, ids) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    if (type === 1) {
      // 提交作业
      const nextId = ids.length ? ids[ids.length - 1].id + 1 : 1000
      connection.query(
        `insert into sys_done_list (id, account, class_id, homework_id, protocol, date, status) values (${nextId}, '${account}', ${class_id}, ${homework_id}, '${protocol}', '${dayjs().format(
          'YYYY-MM-DD HH:mm:ss'
        )}', 1)`,
        error => {
          if (error) {
            res.send({
              code: 10001,
              info: null,
              msg: '[SELECT ERROR] - ' + error.message
            })
            return
          }
          res.send({
            code: 200,
            info: true,
            msg: '提交成功！'
          })
        }
      )
    } else {
      // 修改作业
      connection.query(
        `update sys_done_list set protocol='${protocol}' where homework_id=${homework_id} and class_id=${class_id} and account='${account}'`,
        err => {
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
            info: true,
            msg: '修改成功！'
          })
        }
      )
    }
  })
}

module.exports.my_homeworkDetail = function (req, res) {
  console.log('/homework/detail')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, homework_id, status } = req.body
  if (id) {
    // 从作业已完成列表点进来的
    const sql = `select distinct h.title, h.info, c.class_view, u.account, u.username, d.protocol, d.score, d.desc, o.course_name from sys_homework_list h inner join sys_class_list c on (h.class_id=c.class_id) inner join sys_done_list d on (d.homework_id=h.id) inner join sys_user_liao u on (d.account=u.account) inner join sys_course_list o on (o.course_id=h.course_id) where d.id=${id}`
    connection.query(sql, (err, results) => {
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
        info: results[0],
        msg: '获取成功！'
      })
    })
  } else {
    // 从作业列表进来的
    if (data.identity === 'student') {
      if (status) {
        // 已批改
        const sql = `select h.title, h.info, c.class_view, u.account, u.username, d.protocol, d.score, d.desc from sys_homework_list h inner join sys_class_list c on (h.class_id=c.class_id) inner join sys_done_list d on (d.homework_id=h.id) inner join sys_user_liao u on (d.account=u.account) where d.homework_id=${homework_id} and d.account='${data.account}'`
        connection.query(sql, (err, results) => {
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
            info: results[0],
            msg: '获取成功！'
          })
        })
      } else {
        // 未批改
        connection.query(
          `select title, info, protocol from sys_homework_list where id=${homework_id}`,
          (err, results) => {
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
              info: results[0],
              msg: '获取成功！'
            })
          }
        )
      }
    } else {
      connection.query(`select * from sys_homework_list where id=${homework_id}`, (err, results) => {
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
          info: results[0],
          msg: '获取成功！'
        })
      })
    }
  }
}

module.exports.my_homeworkDoneList = function (req, res) {
  console.log('/homework/done/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, class_id, homework_id } = req.body
  let sql = `select distinct d.id, o.course_name, h.title, d.homework_id, c.class_id, c.class_view, u.account, u.username, d.status from sys_done_list d inner join sys_class_list c on (d.class_id=c.class_id) inner join sys_user_info u on (u.account=d.account) inner join sys_homework_list h on (h.id=d.homework_id) inner join sys_course_list o on (o.course_id=h.course_id)`
  if (class_id || homework_id) {
    let classStr = ''
    let homeworkStr = ''
    if (class_id) classStr = `d.class_id=${class_id}`
    if (homework_id) homeworkStr = `d.homework_id=${homework_id}`
    sql = sql + ` where ${classStr}${classStr && homeworkStr && ' and '}${homeworkStr}`
  }
  connection.query(sql, (err, result) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    const total = result.length
    const maxPage = Math.ceil(total / pageSize)
    let _page = page
    if (_page > maxPage) _page = maxPage
    const results = result.slice((_page - 1) * pageSize, (_page - 1) * pageSize + pageSize)
    res.send({
      code: 200,
      info: {
        items: results,
        page: _page,
        pageSize,
        total,
        maxPage
      },
      msg: 'success'
    })
  })
}

module.exports.my_homeworkCount = function (req, res) {
  console.log('/homework/count')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { class_id, course_id } = req.body
  connection.query(
    `select * from sys_homework_list where course_id='${course_id}' and class_id='${class_id}' order by date asc`,
    (err, homeworks) => {
      if (err) throw err
      if (!homeworks.length) {
        return res.send({
          code: 10001,
          info: null,
          msg: '还未布置作业'
        })
      }
      connection.query(`select * from sys_done_list where class_id='${class_id}'`, (error, dones) => {
        if (error) throw error
        connection.query(`select class_count from sys_class_list where class_id='${class_id}'`, (err, class_counts) => {
          if (err) throw err
          const yMax = class_counts[0].class_count
          const xData = homeworks.map(item => item.title)
          const homework_list = homeworks.map(item => item.id)
          const yData = []
          homework_list.forEach(id => {
            yData.push(dones.filter(item => item.homework_id === id).length)
          })
          res.send({
            code: 200,
            info: {
              xData,
              yData,
              yMax
            }
          })
        })
      })
    }
  )
}

module.exports.my_homeworkCountTotal = function (req, res) {
  console.log('/homework/count/total')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { class_id, course_id } = req.body
  connection.query(
    `select distinct h.title, c.class_view, u.username, o.course_name, d.score from sys_done_list d inner join sys_homework_list h on (d.homework_id=h.id) inner join sys_user_info u on (d.account=u.account) inner join sys_class_list c on (d.class_id=c.class_id) inner join sys_course_list o on (o.course_id=h.course_id) where h.course_id='${course_id}' and d.class_id='${class_id}' and o.class_id='${class_id}'`,
    (err, results) => {
      if (err) throw err
      res.send({
        code: 200,
        info: results,
        msg: 'success'
      })
    }
  )
}
