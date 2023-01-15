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
`brith` date not null comment '生日'
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
`name` varchar(16) not null comment '实验室名称'
) comment '已预约列表';