const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')

module.exports.my_experimentlist = function (req, res) {
  console.log('/experiment/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, time } = req.body
  let sql = `select * from sys_experiment_list order by time`
  if (time) {
    sql = `select * from sys_experiment_list where time='${time}' order by time`
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

module.exports.my_appointExperiment = function (req, res) {
  console.log('/experiment/appoint')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { ID, key } = req.body
  const sql = `select * from sys_experiment_list where ID=${ID}`
  console.log(sql)
  connection.query(sql, (err, results) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    let updateObj = {}
    for (let i = 0; i < results.length; i++) {
      if (results[i].ID === ID) {
        if (data.identity === 'student') {
          results[i][key]--
          updateObj = results[i]
        } else {
          results[i][key] = 0
          updateObj = results[i]
        }
      }
    }
    const updateSql = `update sys_experiment_list set ${key}=${updateObj[key]} where ID=${updateObj.ID}`
    connection.query(updateSql, (err, results) => {
      if (err) {
        res.send({
          code: 10001,
          info: null,
          msg: '[SELECT ERROR] - ' + err.message
        })
        return
      }
      connection.query(`select * from sys_appointment_list`, (err, results_data) => {
        if (err) {
          res.send({
            code: 10001,
            info: null,
            msg: '[SELECT ERROR] - ' + err.message
          })
          return
        }
        const nextId = results_data.length ? ++results_data[results_data.length - 1].id : 1000
        const sql = `insert into sys_appointment_list (id, account, course, time, name) values (${nextId}, '${data.account}', '${key}', '${updateObj.time}', '${updateObj.name}')`
        connection.query(sql, () => {
          res.send({
            code: 200,
            info: true,
            msg: '预约成功！'
          })
        })
      })
    })
  })
}

module.exports.my_appointList = function (req, res) {
  console.log('/appoint/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const sql = `select * from sys_appointment_list where account='${data.account}' order by time desc`
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
      info: results.filter(item => +new Date(item.time) >= +new Date(dayjs().format('YYYY-MM-DD'))),
      msg: '获取成功！'
    })
  })
}

module.exports.my_cancelAppoint = function (req, res) {
  console.log('/cancel/appoint')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { ID, name, key, time } = req.body
  connection.query(`select ${key} from sys_experiment_list where ID=${ID}`, (err, results) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    let sql = ''
    if (data.identity === 'student') {
      sql = `update sys_experiment_list set ${key}=${results[0] + 1}`
    } else {
      sql = `update sys_experiment_list set ${key}=50`
    }
    connection.query(sql, () => {
      const my_sql = `delete from sys_appointment_list where account='${data.account}' and name='${name}' and time='${time}' and course='${key}'`
      connection.query(my_sql, () => {
        res.send({
          code: 200,
          info: true,
          msg: '取消成功！'
        })
      })
    })
  })
}

module.exports.my_appointCancel = function (req, res) {
  console.log('/cancel/appointlist')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, key, name, time } = req.body
  connection.query(`delete from sys_appointment_list where id=${id}`, err => {
    if (err) throw err
    connection.query(`select * from sys_experiment_list where name='${name}' and time='${time}'`, (err, results) => {
      if (err) throw err
      let sql = ''
      if (data.identity === 'student') {
        sql = `update sys_experiment_list set ${key}=${results[0][key] + 1} where name='${name}' and time='${time}'`
      } else {
        sql = `update sys_experiment_list set ${key}=50 where name='${name}' and time='${time}'`
      }
      connection.query(sql, err => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '取消成功！'
        })
      })
    })
  })
}

module.exports.my_appointlistPage = function (req, res) {
  console.log('/appoint/list/page')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize } = req.body
  connection.query(
    `select * from sys_appointment_list where account='${data.account}' order by time desc`,
    (err, result) => {
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
    }
  )
}

module.exports.my_appointDelete = function (req, res) {
  console.log('/appoint/delete')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id } = req.body
  connection.query(`delete from sys_appointment_list where id=${id}`, () => {
    res.send({
      code: 200,
      info: true,
      msg: '删除成功！'
    })
  })
}

module.exports.my_experienceList = function (req, res) {
  console.log('/experience/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, id } = req.body
  let sql = `select * from sys_experience_list order by createTime desc`
  if(id) {
    sql = `select * from sys_experience_list where id=${id} order by createTime desc`
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

module.exports.my_experienceAdd = function (req, res) {
  console.log('/experience/saveOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, name, protocol } = req.body
  if (id) {
    // 修改
    connection.query(
      `update sys_experience_list set name='${name}', protocol='${protocol}', createTime='${dayjs().format(
        'YYYY-MM-DD HH:mm:ss'
      )} where id=${id}`,
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
    return
  } else {
    // 发布
    connection.query(`select id from sys_experience_list`, (err, results) => {
      if (err) {
        res.send({
          code: 10001,
          info: null,
          msg: '[SELECT ERROR] - ' + err.message
        })
        return
      }
      const nextId = results.length ? results[results.length - 1].id + 1 : 1000
      const sql = `insert into sys_experience_list (id, name, createTime, protocol) values (${nextId}, '${name}', '${dayjs().format(
        'YYYY-MM-DD HH:mm:ss'
      )}', '${protocol}')`
      connection.query(sql, err => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '发布成功！'
        })
      })
    })
  }
}
