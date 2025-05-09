// orm.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('university_db', 'root', '930601', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false, // 關閉 SQL 日誌
});

module.exports = { sequelize, DataTypes };
