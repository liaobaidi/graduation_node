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
const { uploadFile, uploadProtocol } = require('../handlers/utils')
const {
  my_experimentlist,
  my_appointExperiment,
  my_appointList,
  my_cancelAppoint,
  my_appointCancel,
  my_appointlistPage,
  my_appointDelete,
  my_experienceList,
  my_experienceAdd
} = require('../handlers/experiment')
const { my_noticeList, my_noticeInfo, my_noticeUpdate } = require('../handlers/message')
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

  /**
   * 实验室列表
   */
  router.post('/experiment/list', (req, res) => my_experimentlist(req, res))

  /**
   * 预约实验室
   */
  router.post('/experiment/appoint', (req, res) => my_appointExperiment(req, res))

  /**
   * 预约列表
   */
  router.get('/appoint/list', (req, res) => my_appointList(req, res))

  /**
   * 取消预约
   */
  router.post('/cancel/appoint', (req, res) => my_cancelAppoint(req, res))

  /**
   * 公告列表
   */
  router.post('/notice/list', (req, res) => my_noticeList(req, res))

  /**
   * 公告详情
   */
  router.post('/notice/info', (req, res) => my_noticeInfo(req, res))

  /**
   * 添加或修改公告
   */
  router.post('/notice/updateOrSave', (req, res) => my_noticeUpdate(req, res))

  /**
   * 上传附件
   */
  router.post('/upload/protocol', (req, res) => uploadProtocol(req, res))

  /**
   * 预约列表的取消预约
   */
  router.post('/cancel/appointlist', (req, res) => my_appointCancel(req, res))

  /**
   * 分页获取预约列表
   */
  router.post('/appoint/list/page', (req, res) => my_appointlistPage(req, res))

  /**
   * 删除预约记录
   */
  router.post('/appoint/delete', (req, res) => my_appointDelete(req, res))

  /**
   * 实验列表
   */
  router.post('/experience/list', (req, res) => my_experienceList(req, res))

  /**
   * 发布或修改实验
   */
  router.post('/experience/saveOrUpdate', (req, res) => my_experienceAdd(req, res))
  return router
}
