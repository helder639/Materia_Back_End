const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('api_pessoas', 'postgres', 'postgres6', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;