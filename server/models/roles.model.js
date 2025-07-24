module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    }, {
        tableName: 'user_roles',
        timestamps: true,
        underscored: true,
    });
    UserRole.associate = (models) => {
        UserRole.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
    };
    return UserRole;
};