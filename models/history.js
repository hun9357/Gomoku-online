/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history', {
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
    win: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'history',
    timestamps: false
  });
};
