const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
