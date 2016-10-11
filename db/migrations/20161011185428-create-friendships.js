'use strict';

const STATUS = {
  PENDING: 'pending',
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  REJECTED: 'rejected',
  BANNED: 'banned'
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Friendships', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      friendId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: Object.keys(STATUS).map(key => STATUS[key]),
        defaultValue: 'pending'
      },
      acceptedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      requestedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      declinedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejectedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      bannedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Friendships')
  }
};
