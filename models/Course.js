const { sequelize, DataTypes } = require('../orm');

const Course = sequelize.define('Course', {
    Course_ID: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true
    },
    Title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Credits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1
        }
    },
    Level: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            isIn: [['大學部', '研究所']]
        }
    },
    Hours_Per_Week: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
            min: 0
        }
    },
    Department_ID: {
        type: DataTypes.STRING(5),
        allowNull: true,
    }
}, {
    tableName: 'COURSE',
    timestamps: false
});

module.exports = Course;
