/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pwhash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nickname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    lose: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    }
}, {
    tableName: 'users',
    timestamps: false
  });
};
