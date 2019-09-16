'use strict';
module.exports = (sequelize, DataTypes) => {
  const content = sequelize.define('content', {
    content: DataTypes.STRING
  }, {});
  content.associate = function(models) {
    // associations can be defined here
  };
  return content;
};