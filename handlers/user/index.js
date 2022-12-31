const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')
module.exports.my_userlist = function (req, res) {
  console.log('/user/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  if (data.identity !== 'admin') {
    return res.send({
      code: 404,
      info: null,
      msg: '没有权限'
    })
  }
  const { page, pageSize, account, identity } = req.body
  let sql = 'select id, username, account, class_id, identity from sys_user_liao'
  if (account || identity) {
    let accountStr = ''
    let identityStr = ''
    if (account) accountStr = `account=${account}`
    if (identity) identityStr = `identity='${identity}'`
    sql = sql + ` where ${accountStr}${accountStr && identityStr && ' and '}${identityStr}`
  }

  console.log(sql)
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
module.exports.my_userExport = function (req, res) {
  console.log('/user/export')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { pageSize, account, identity } = req.body
  let sql = 'select id, username, account, class_id, identity from sys_user_liao'
  if (account || identity) {
    let accountStr = ''
    let identityStr = ''
    if (account) accountStr = `account=${account}`
    if (identity) identityStr = `identity='${identity}'`
    sql = sql + ` where ${accountStr}${accountStr && identityStr && ' and '}${identityStr}`
  }
  console.log(sql)
  connection.query(sql, (err, result) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    const results = result.slice(0, pageSize)
    res.send({
      code: 200,
      info: results,
      msg: 'success'
    })
  })
}
module.exports.my_userInsert = function (req, res) {
  console.log('/user/insert')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { account, username, class_id, identity } = req.body
  const sql = `select id from sys_user_liao where identity='${identity}'`
  console.log(sql)
  let nextId = -1
  connection.query(sql, (err, result) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    nextId = result[result.length - 1].id + 1
    const sql2 = `insert into sys_user_liao (id, account ,username, psw, class_id, identity ) values (${nextId},'${account}', '${username}', '000000', ${class_id}, '${identity}');`
    console.log(sql2)
    connection.query(sql2, () => {
      res.send({
        code: 200,
        info: true,
        msg: '添加成功！'
      })
    })
  })
}
