create database db;

use db;

-- drop table sys_user_liao;

-- 用户表
create table if not exists `sys_user_liao`
(
`id` int not null auto_increment comment 'ID' primary key,
`username` varchar(16) not null comment '用户名',
`account` varchar(16) not null comment '账号',
`psw` varchar(32) not null comment '密码',
`class_id` int comment '班级ID',
`identity` varchar(8) not null comment '权限标识'
) comment '用户表';

-- 用户详情表
create table if not exists `sys_user_info`
(
`id` int not null auto_increment comment 'ID' primary key,
`username` varchar(16) not null comment '用户名',
`gender` varchar(4) not null comment '性别',
`email` varchar(32) not null comment '邮箱',
`phone` varchar(11) null comment '联系电话',
`brith` date not null comment '生日',
`url` varchar(255) null comment '头像',
`account` varchar(16) not null comment '账号',
`class_id` int comment '班级ID'
) comment '用户详情表';

-- 实验室列表
create table if not exists `sys_experiment_list`
(
`ID` int not null auto_increment comment '唯一标识' primary key,
`name` varchar(16) not null comment '名称',
`one_two` int not null comment '一二节',
`three_four` int not null comment '三四节',
`five` int not null comment '第五节',
`six_seven` int not null comment '六七节',
`eight_nine` int not null comment '八九节',
`ten_twi` int not null comment '十十二节',
`time` varchar(16) not null comment '日期'
) comment '实验室列表';

-- 已预约列表
create table if not exists `sys_appointment_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`account` varchar(16) not null comment '学号',
`course` varchar(16) not null comment '课时',
`time` varchar(16) not null comment '日期',
`name` varchar(16) not null comment '实验室名称',
`appoint_count` int not null comment '预约台数'
) comment '已预约列表';

-- 公告列表
create table if not exists `sys_notice_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`title` varchar(64) not null comment '标题',
`author` varchar(16) not null comment '作者',
`info` text not null comment '内容',
`date` varchar(32) not null comment '日期',
`protocol` varchar(256) null comment '附件',
`account` varchar(16) not null comment '账号'
) comment '公告列表';

-- 实验列表
create table if not exists `sys_experience_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`name` varchar(64) not null comment '实验名称',
`createTime` varchar(64) not null comment '发布日期',
`protocol` varchar(256) not null comment '资料'
) comment '实验列表';

-- 作业列表
create table if not exists `sys_homework_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`author_id` varchar(32) not null comment '发布者工号',
`title` varchar(64) not null comment '标题',
`info` text not null comment '内容',
`protocol` varchar(256) null comment '附件',
`class_id` int null comment '班级ID',
`date` varchar(32) not null comment '截至日期'
) comment '作业列表';

-- 已完成列表
create table if not exists `sys_done_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`account` varchar(16) not null comment '学号',
`date` varchar(32) not null comment '完成日期',
`homework_id` int not null comment '作业ID',
`protocol` varchar(256) null comment '附件',
`class_id` int comment '班级ID',
`score` varchar(16) null comment '成绩',
`desc` text null comment '评语',
`status` int not null comment '状态(1：未批改，2：已批改)'
) comment '已完成列表';

-- 班级列表
create table if not exists `sys_class_list`
(
`id` int not null auto_increment comment '唯一标识' primary key,
`class_id` varchar(16) not null comment '班级ID',
`class_view` varchar(32) not null comment '班级名称',
`class_count` int not null comment '班级人数'
) comment '班级列表';

-- 评论列表
create table if not exists `sys_comment_list`
(
`id` int not null auto_increment comment 'ID' primary key,
`account` varchar(32) not null comment '学号/工号',
`video_id` int not null comment '视频ID',
`info` text not null comment '评论内容',
`date` varchar(256) not null comment '用户名'
) comment '评论列表';

-- 视频列表
create table if not exists `sys_video_list`
(
`id` int not null auto_increment comment '视频ID' primary key,
`account` varchar(32) not null comment '工号',
`name` text not null comment '视频名称',
`url` text not null comment '视频链接',
`cover` text not null comment '视频封面',
`date` varchar(256) not null comment '发布日期'
) comment '视频列表';

-- 资料列表
create table if not exists `sys_file_list`
(
`id` int not null auto_increment comment 'ID' primary key,
`name` varchar(256) not null comment '资料名称',
`url` text not null comment '资料地址',
`download_count` int not null comment '下载次数'
) comment '资料列表';

-- 课程
create table if not exists `sys_course_list`
(
  `id` int not null auto_increment comment 'ID' primary key,
  `course_id` varchar(256) not null comment '课程编号',
  `course_name` varchar(256) not null comment '课程名称',
  `teacher_id` varchar(16) not null comment '教师',
  `class_id` varchar(16) not null comment '班级',
  `time` varchar(256) not null comment '日期',
  `course_time` varchar(256) not null comment '课时标识',
  `course_view` varchar(256) not null comment '课时展示',
  `sign_in` int null comment '是否签到',
  `sign_psw` varchar(256) null comment '签到密码',
  `experiment_id` varchar(256) not null comment '实验室ID'
) comment '课程表';

-- 签到表
create table if not exists `sys_sign_list`
(
  `id` int not null auto_increment comment 'ID' primary key,
  `student_id` varchar(16) not null comment '学生学号',
  `course_id` varchar(256) not null comment '课程编号',
  `class_id` varchar(16) not null comment '班级',
  `time` varchar(256) not null comment '日期',
  `course_time` varchar(256) not null comment '课时标识'
) comment '签到表';