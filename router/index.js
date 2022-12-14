const { my_login, my_logout, my_update } = require('../handlers/sys')
const {
  my_userlist,
  my_userExport,
  my_userInsert,
  my_listInsert,
  my_deleteUser,
  my_userInfo,
  my_userUpdate
} = require('../handlers/user')
const { uploadFile } = require('../handlers/utils')
module.exports.createRouter = function (app, express) {
  const router = express.Router()

  /**
   * 登录
   */
  router.post('/sys/login', (req, res) => my_login(req, res))

  /**
   * 修改密码
   */
  router.post('/sys/update', (req, res) => my_update(req, res))

  /**
   * 用户列表
   */
  router.post('/user/list', (req, res) => my_userlist(req, res))

  /**
   * 登出
   */
  router.post('/sys/logout', (req, res) => my_logout(req, res))

  /**
   * 用户列表导出
   */
  router.post('/user/export', (req, res) => my_userExport(req, res))

  /**
   * 添加用户
   */
  router.post('/user/insert', (req, res) => my_userInsert(req, res))

  /**
   * 批量导入用户
   */
  router.post('/user/import', (req, res) => my_listInsert(req, res))

  /**
   * 删除用户
   */
  router.post('/user/delete', (req, res) => my_deleteUser(req, res))
  /**
   * 用户详情
   */
  router.post('/user/info', (req, res) => my_userInfo(req, res))
  /**
   * 修改详情
   */
  router.post('/user/saveOrUpdate', (req, res) => my_userUpdate(req, res))

  /**
   * 上传图片接口
   */
  router.post('/upload/image', (req, res) => uploadFile(req, res))
  return router
}
