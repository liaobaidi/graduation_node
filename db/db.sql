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