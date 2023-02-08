const dayjs = require('dayjs')
const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')

module.exports.my_fileList = function (req, res) {
  console.log('/file/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, keyWord } = req.body
  let keys = ''
  if (keyWord) keys = `%${keyWord}%`
  const sql = `select * from sys_file_list ${
    keys ? "where name like '" + keys + "'" : ''
  } order by download_count desc, name asc`
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

module.exports.my_addOrUpdateFile = function (req, res) {
  console.log('/file/addOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, name, url } = req.body
  if (id) {
    // 修改
    connection.query(`update sys_file_list set name='${name}', url='${url}' where id=${id}`, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '修改成功！'
      })
    })
  } else {
    // 创建
    connection.query(`insert into sys_file_list (name, url, download_count) values ('${name}', '${url}', 0)`, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '创建成功！'
      })
    })
  }
}

module.exports.my_downloadAdd = function (req, res) {
  console.log('/download/add')
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
  connection.query(`select download_count from sys_file_list where id=${id}`, (err, result) => {
    if (err) {
      res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
      return
    }
    const new_count = result[0].download_count + 1
    connection.query(`update sys_file_list set download_count=${new_count} where id=${id}`, err => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '下载成功！'
      })
    })
  })
}

module.exports.my_deleteFile = function (req, res) {
  console.log('/file/delete')
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
  connection.query(`delete from sys_file_list where id=${id}`, err => {
    if (err) throw err
    res.send({
      code: 200,
      info: true,
      msg: '删除成功！'
    })
  })
}

module.exports.my_fileInfo = function (req, res) {
  console.log('/file/info')
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
  connection.query(`select * from sys_file_list where id=${id}`, (err, result) => {
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
  })
}

module.exports.my_videoList = function (req, res) {
  console.log('/video/list')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { page, pageSize, keyWord } = req.body
  let keys = ''
  if (keyWord) keys = `%${keyWord}%`
  const sql = `select v.id, u.account, u.username, v.name, v.url, v.cover, v.date from sys_video_list v inner join sys_user_info u on (u.account=v.account) ${
    keys ? "where v.name like '" + keys + "'" : ''
  } order by v.date desc`
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

module.exports.my_videoInfo = function (req, res) {
  console.log('/video/info')
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
    `select v.id, u.account, u.username, v.name, v.url, v.cover, v.date from sys_video_list v inner join sys_user_info u on (u.account=v.account) where v.id=${id}`,
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

module.exports.my_addOrUpdate = function (req, res) {
  console.log('/video/addOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, name, url, cover } = req.body
  if (id) {
    // 修改
    connection.query(
      `update sys_video_list set name='${name}', url='${url}', cover='${cover}', account='${
        data.account
      }', date='${dayjs().format('YYYY-MM-DD HH:mm:ss')}' where id=${id}`,
      err => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '修改成功！'
        })
      }
    )
  } else {
    // 添加
    connection.query(
      `insert into sys_video_list (name, url, cover, account, date) values ('${name}', '${url}', '${cover}', '${
        data.account
      }', '${dayjs().format('YYYY-MM-DD HH:mm:ss')}')`,
      err => {
        if (err) throw err
        res.send({
          code: 200,
          info: true,
          msg: '添加成功！'
        })
      }
    )
  }
}

module.exports.my_deleteVideo = function (req, res) {
  console.log('/video/delete')
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
  connection.query(`delete v, c from sys_video_list v left join sys_comment_list c on (v.id=c.video_id) where v.id=${id}`, err => {
    if (err) throw err
    res.send({
      code: 200,
      info: true,
      msg: '删除成功！'
    })
  })
}
