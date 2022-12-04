create database db;

use db;

-- drop table sys_user_liao;

-- `sys_user_liao`
create table if not exists `sys_user_liao`
(
`id` int not null auto_increment comment 'id' primary key,
`username` varchar(16) not null comment '用户名',
`account` varchar(16) not null comment '账号' primary key,
`psw` varchar(32) not null comment '密码',
`class_id` int not null comment '班级id'
) comment '用户表';