const connection = require('../../plugins/config')
const { verify_token } = require('../../utils/token')
const path = require('path')
const xlsx = require('node-xlsx').default
const multiparty = require('multiparty')
const fs = require('fs')
const dayjs = require('dayjs')
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
      const sql3 = `insert into sys_user_info (id, username, gender, email, phone, brith, url, account) values (${nextId},'${username}', '', '', '', '${dayjs().format('YYYY-MM-DD')}', '', '${account}')`
      console.log(sql3);
      connection.query(sql3, () => {
        res.send({
          code: 200,
          info: true,
          msg: '添加成功！'
        })
      })
    })
  })
}
module.exports.my_listInsert = function (req, res) {
  console.log('/user/import')
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
    const admins = list[0].data.filter(item => item[4] === 'admin')
    const teachers = list[0].data.filter(item => item[4] === 'teacher')
    const students = list[0].data.filter(item => item[4] === 'student')
    if (!admins || !admins.length || !teachers || !teachers.length || !students || !students.length) {
      return res.send({
        code: 10001,
        info: null,
        msg: 'Excel格式解析错误'
      })
    }
    console.log(admins, teachers, students)
    connection.query(`select id, identity from sys_user_liao`, (err, result) => {
      if (err) {
        return res.send({
          code: 10001,
          info: null,
          msg: '[SELECT ERROR] - ' + err.message
        })
      }
      let admin_id = result.filter(item => item.identity === 'admin').at(-1).id + 1
      let teacher_id = result.filter(item => item.identity === 'teacher').at(-1).id + 1
      let student_id = result.filter(item => item.identity === 'student').at(-1).id + 1
      admins.forEach(async item => {
        const sql = `insert into sys_user_liao (id, account ,username, psw, class_id, identity ) values (${admin_id}, '${item[0]}', '${item[1]}', '${item[2]}', ${item[3]}, '${item[4]}')`
        console.log(sql)
        await connection.query(sql)
        const sql2 = `insert into sys_user_info (id, username, gender, email, phone, brith, url, account) values (${admin_id},'${item[1]}', '', '', '', '${dayjs().format('YYYY-MM-DD')}', '', '${item[0]}')`
        await connection.query(sql2)
        admin_id++
      })
      teachers.forEach(async item => {
        const sql = `insert into sys_user_liao (id, account ,username, psw, class_id, identity ) values (${teacher_id}, '${item[0]}', '${item[1]}', '${item[2]}', ${item[3]}, '${item[4]}')`
        console.log(sql)
        await connection.query(sql)
        const sql2 = `insert into sys_user_info (id, username, gender, email, phone, brith, url, account) values (${teacher_id},'${item[1]}', '', '', '', '${dayjs().format('YYYY-MM-DD')}', '', '${item[0]}')`
        await connection.query(sql2)
        teacher_id++
      })
      students.forEach(async item => {
        const sql = `insert into sys_user_liao (id, account ,username, psw, class_id, identity ) values (${student_id}, '${item[0]}', '${item[1]}', '${item[2]}', ${item[3]}, '${item[4]}')`
        console.log(sql)
        await connection.query(sql)
        const sql2 = `insert into sys_user_info (id, username, gender, email, phone, brith, url, account) values (${student_id},'${item[1]}', '', '', '', '${dayjs().format('YYYY-MM-DD')}', '', '${item[0]}')`
        await connection.query(sql2)
        student_id++
      })
    })
    res.send({ code: 200, info: true, msg: '导入成功！' })
  })
}
module.exports.my_deleteUser = function (req, res) {
  console.log('/user/import')
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
  const sql = `delete u, i from sys_user_liao u left join sys_user_info i on (u.account=i.account) where u.id=${id}`
  connection.query(sql, (err, result) => {
    if (err) {
      return res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
    }
    res.send({
      code: 200,
      info: true,
      msg: '删除成功！'
    })
  })
}
module.exports.my_userInfo = function (req, res) {
  console.log('/user/info')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  // const { account } = req.body
  const sql = `select * from sys_user_info where account='${data.account}'`
  connection.query(sql, (err, results) => {
    if (err) {
      return res.send({
        code: 10001,
        info: null,
        msg: '[SELECT ERROR] - ' + err.message
      })
    }
    res.send({
      code: 200,
      info: results,
      msg: '获取成功！'
    })
  })
}
module.exports.my_userUpdate = function (req, res) {
  console.log('/user/saveOrUpdate')
  const { authorization } = req.headers
  const data = verify_token(authorization)
  if (!data) {
    return res.send({
      code: 401,
      info: null,
      msg: 'token失效'
    })
  }
  const { id, username, account, email, phone, url, brith, gender } = req.body
  if (id) {
    // 修改信息
    const sql = `update sys_user_info set username='${username}', email='${email}', phone='${phone}', url='${url}', brith='${brith}', gender='${gender}' where account='${account}'`
    console.log(sql)
    connection.query(sql, (err, results) => {
      if (err) throw err
      res.send({
        code: 200,
        info: true,
        msg: '修改成功！'
      })
    })
    return
  } else {
    // 插入信息
    const sql = `insert into sys_user_info (username, gender, email, phone, brith, url, account) values ('${
      username || ''
    }', '${gender || '1'}', '${email || ''}', '${phone || ''}', '${brith || dayjs().format('YYYY-MM-DD')}', '${url || ''}', '${data.account}')`
    console.log(sql)
    connection.query(sql, () => {
      res.send({
        code: 200,
        info: true,
        msg: '修改成功！'
      })
    })
  }
}
