const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')

module.exports.my_noticeList = function (req, res) {
  console.log('/notice/list')
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
  connection.query(`select * from sys_notice_list order by date desc`, (err, result) => {
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

module.exports.my_noticeInfo = function (req, res) {
  console.log('/notice/info')
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
  connection.query(`select * from sys_notice_list where id=${id}`, (err, result) => {
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
      info: result[0],
      msg: 'success'
    })
  })
}

module.exports.my_noticeUpdate = function (req, res) {
  console.log('/notice/updateOrSave')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, author, title, info, date, protocol, account } = req.body
  if (id) {
    // 修改
    console.log(protocol);
    const sql = `update sys_notice_list set author='${author}', title='${title}', info='${info}', date='${date}', protocol='${protocol || ''}', account='${account}' where id=${id}`
    connection.query(sql, (err, result) => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '修改成功！'
      })
    })
    return
  } else {
    // 添加
    connection.query(`select id from sys_notice_list`, (err, results) => {
      if (err) throw err
      const nextId = results.length ? results[results.length - 1].id + 1 : 1000
      const sql = `insert into sys_notice_list (id, title, author, info, date, protocol, account) values (${nextId}, '${title}', '${author}', '${info}', '${date}', '${protocol || ''}', '${account}')`
      connection.query(sql, (err, result) => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '发布成功！'
        })
      })
    })
    return
  }
}
