
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    admin: {
      type: DataTypes.BOOLEAN
    },
    language: DataTypes.STRING
  }
  )

  User.associate = function (models) {
  }

  return User
}
