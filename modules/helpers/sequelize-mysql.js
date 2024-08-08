'use strict';

let SequelizeObj = require("sequelize"),
    mysql_config   = process.config.global_config.mysql;

const Op = SequelizeObj.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

let options = {
  logging: false,
  dialectOptions: {
    decimalNumbers: true,
    supportBigNumbers: true
  },
  host:mysql_config.host,
  port:mysql_config.port,
  dialect:'mysql',
  operatorsAliases :operatorsAliases,
  define: {
    timestamps: false
}
}
let sequelize_mysql = new SequelizeObj(mysql_config.database_name,mysql_config.user_name,mysql_config.password,options);

sequelize_mysql.Promise = global.Promise;

module.exports = sequelize_mysql;
