const { sequelize, DataTypes } = require('../orm');

const Enrollment = sequelize.define('Enrollment', {
  Student_ID: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    allowNull: false    
  },
  Course_ID: {
    type: DataTypes.STRING(8),
    primaryKey: true,
    allowNull: false 
  },
  Semester_ID: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false 
  },
  Enrollment_Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Grade: {
    type:DataTypes.DECIMAL(4,1),
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '修課中',
    validate: {
      isIn: [['修課中', '通過', '退選','轉系退選','轉系加選','不通過']]
    }
  }
}, {
  tableName: 'ENROLLMENT',
  timestamps: false
});

module.exports = Enrollment;
