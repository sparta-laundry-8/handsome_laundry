'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      email: {
        type: Sequelize.STRING,
        Unique: true
      },
      nickname: {
        type: Sequelize.STRING,
        Unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      cellphone: {
        type: Sequelize.STRING,
        Unique: true
      },
      laundryid: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      point: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};