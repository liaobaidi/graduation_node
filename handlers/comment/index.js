const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')

module.exports.my_commentList = function (req, res) {
  console.log('/comment/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, video_id } = req.body
  let sql = `select c.id, c.info, c.date, u.username, u.account, u.url, v.name from sys_comment_list c inner join sys_user_info u on (c.account=u.account) inner join sys_video_list v on (c.video_id=v.id) order by c.date desc, c.info asc`
  if(video_id) {
    sql = `select c.id, c.info, c.date, u.username, u.account, u.url, v.name from sys_comment_list c inner join sys_user_info u on (c.account=u.account) inner join sys_video_list v on (c.video_id=v.id) where video_id=${video_id} order by c.date desc, c.info asc`
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

module.exports.my_commentInfo = function (req, res) {
  console.log('/comment/info')
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
  connection.query(
    `select c.id, c.info, c.date, u.username, v.name from sys_comment_list c inner join sys_user_info u on (c.account=u.account) inner join sys_video_list v on (c.video_id=v.id) where c.id=${id}`,
    (err, result) => {
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
        msg: '获取成功！'
      })
    }
  )
}

module.exports.my_addOrUpdateComment = function (req, res) {
  console.log('/comment/addOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, info, video_id } = req.body
  if (id) {
    // 修改
    connection.query(`update sys_comment_list set info='${info}' where id=${id}`, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '修改成功！'
      })
    })
  } else {
    // 新增
    connection.query(
      `insert into sys_comment_list (account, video_id, info, date) values ('${
        data.account
      }', ${video_id}, '${info}', '${dayjs().format('YYYY-MM-DD HH:mm:ss')}')`,
      err => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '评论成功！'
        })
      }
    )
  }
}

module.exports.my_deleteComment = function (req, res) {
  console.log('/comment/delete')
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
  connection.query(`delete from sys_comment_list where id=${id}`, err => {
    if (err) throw err
    res.send({
      code: 200,
      info: true,
      msg: '删除成功！'
    })
  })
}
