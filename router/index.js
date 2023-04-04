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
const { uploadFile, uploadProtocol, uploadVideo } = require('../handlers/utils')
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
const {
  my_homeworkList,
  my_homeworkSaveOrUpdate,
  my_homeworkCheck,
  my_homeworkCommit,
  my_homeworkDetail,
  my_homeworkDoneList,
  my_homeworkCount,
  my_homeworkCountTotal
} = require('../handlers/homework')
const {
  my_fileList,
  my_addOrUpdateFile,
  my_downloadAdd,
  my_deleteFile,
  my_fileInfo,
  my_videoList,
  my_videoInfo,
  my_deleteVideo,
  my_addOrUpdate
} = require('../handlers/datamange')
const { my_commentList, my_commentInfo, my_deleteComment, my_addOrUpdateComment } = require('../handlers/comment')
const {
  my_courseList,
  my_importCourse,
  my_signInStart,
  my_signInEnd,
  my_signIn,
  my_signInStatus,
  my_signInNum,
  my_signInCount,
  my_courseForTeacher,
  my_courseClassList
} = require('../handlers/course')
const {
  my_terminalCount,
  my_terminalGrade,
  my_terminalGradeCount,
  my_getTerminalGrade
} = require('../handlers/teminal')
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

  /**
   * 作业列表
   */
  router.post('/homework/list', (req, res) => my_homeworkList(req, res))

  /**
   * 发布或修改作业
   */
  router.post('/homework/saveOrUpdate', (req, res) => my_homeworkSaveOrUpdate(req, res))

  /**
   * 批改作业
   */
  router.post('/homework/check', (req, res) => my_homeworkCheck(req, res))

  /**
   * 提交/修改作业
   */
  router.post('/homework/commit', (req, res) => my_homeworkCommit(req, res))

  /**
   * 作业详情
   */
  router.post('/homework/detail', (req, res) => my_homeworkDetail(req, res))

  /**
   * 已完成列表
   */
  router.post('/homework/done/list', (req, res) => my_homeworkDoneList(req, res))

  /**
   * 视频上传
   */
  router.post('/upload/video', (req, res) => uploadVideo(req, res))

  /**
   * 资料列表
   */
  router.post('/file/list', (req, res) => my_fileList(req, res))

  /**
   * 添加或修改资料
   */
  router.post('/file/addOrUpdate', (req, res) => my_addOrUpdateFile(req, res))

  /**
   * 下载次数添加
   */
  router.post('/download/add', (req, res) => my_downloadAdd(req, res))

  /**
   * 删除文件
   */
  router.post('/file/delete', (req, res) => my_deleteFile(req, res))

  /**
   * 资料详情
   */
  router.post('/file/info', (req, res) => my_fileInfo(req, res))

  /**
   * 视频列表
   */
  router.post('/video/list', (req, res) => my_videoList(req, res))

  /**
   * 视频详情
   */
  router.post('/video/info', (req, res) => my_videoInfo(req, res))

  /**
   * 删除视频
   */
  router.post('/video/delete', (req, res) => my_deleteVideo(req, res))

  /**
   * 添加或修改视频
   */
  router.post('/video/addOrUpdate', (req, res) => my_addOrUpdate(req, res))

  /**
   * 评论列表
   */
  router.post('/comment/list', (req, res) => my_commentList(req, res))

  /**
   * 评论详情
   */
  router.post('/comment/info', (req, res) => my_commentInfo(req, res))

  /**
   * 删除评论
   */
  router.post('/comment/delete', (req, res) => my_deleteComment(req, res))

  /**
   * 添加或修改评论
   */
  router.post('/comment/addOrUpdate', (req, res) => my_addOrUpdateComment(req, res))

  /**
   * 课程表
   */
  router.post('/course/list', (req, res) => my_courseList(req, res))

  /**
   * 导入课程表
   */
  router.post('/course/import', (req, res) => my_importCourse(req, res))

  /**
   * 开始签到
   */
  router.post('/course/sigin/start', (req, res) => my_signInStart(req, res))

  /**
   * 结束签到
   */
  router.post('/course/signin/end', (req, res) => my_signInEnd(req, res))

  /**
   * 签到
   */
  router.post('/course/signin', (req, res) => my_signIn(req, res))

  /**
   * 签到状态
   */
  router.post('/course/signin/status', (req, res) => my_signInStatus(req, res))

  /**
   * 获取签到人数
   */
  router.post('/course/signin/num', (req, res) => my_signInNum(req, res))

  /**
   * 考勤统计
   */
  router.post('/course/signin/count', (req, res) => my_signInCount(req, res))

  /**
   * 课程选择
   */
  router.post('/course/list/teach', (req, res) => my_courseForTeacher(req, res))

  /**
   * 获取班级
   */
  router.post('/course/class/list', (req, res) => my_courseClassList(req, res))

  /**
   * 作业统计
   */
  router.post('/homework/count', (req, res) => my_homeworkCount(req, res))

  /**
   * 作业统计列表
   */
  router.post('/homework/count/total', (req, res) => my_homeworkCountTotal(req, res))

  /**
   * 期末信息统计
   */
  router.post('/terminal/count/list', (req, res) => my_terminalCount(req, res))

  /**
   * 期末评分
   */
  router.post('/terminal/count/grade', (req, res) => my_terminalGrade(req, res))

  /**
   * 期末成绩
   */
  router.post('/terminal/count', (req, res) => my_terminalGradeCount(req, res))

  /**
   * 成绩查询
   */
  router.post('/terminal/count/stu', (req, res) => my_getTerminalGrade(req, res))
  return router
}
