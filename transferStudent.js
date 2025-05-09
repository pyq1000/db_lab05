// transferStudent.js
const { sequelize, Student, Course, Enrollment } = require('./models');

async function transferStudent(studentId, oldDeptId, newDeptId) {
    const pool = await sequelize.transaction();
    const currentSemester = '112-1';
    try {
        console.log(`--- 開始處理學生 ${studentId} 轉系流程 ---`);

        // 1. 更新學生所屬系所
        console.log(`1. 更新學生系所為 ${newDeptId}`);
        await Student.update(
            { Department_ID: newDeptId },
            { where: { Student_ID: studentId }, transaction: pool }
        );
        console.log(`學生 ${studentId} 的系所已更新`);

        // 2. 標記舊系所必修課程為「轉系退選」
        console.log(`2. 標記舊系所必修課程為「轉系退選」`);
        const oldDeptCourses = await Course.findAll({
            where: { Department_ID: oldDeptId },
            attributes: ['Course_ID'],
            transaction: pool
        });
        const oldDeptCoursesIds = oldDeptCourses.map(c => c.Course_ID);

        if (oldDeptCoursesIds.length > 0) {
            console.log(`舊系所必修課程數量：${oldDeptCoursesIds.length}`);
            const updateCount = await Enrollment.update(
                { Status: '轉系退選' },
                {
                    where: {
                        Student_ID: studentId,
                        Course_ID: oldDeptCoursesIds,
                        Semester_ID: currentSemester
                    },
                    transaction: pool
                }
            );
            console.log(`標記 ${updateCount[0]} 筆舊系所必修課程為「轉系退選」`);
        } else {
            console.log(`學生 ${studentId} 在舊系所 ${oldDeptId} 沒有修必修課程，跳過退選處理`);
        }

        // 3. 加選新系所必修課程
        console.log(`3. 加選新系所 ${newDeptId} 的必修課程`);
        const newDeptCourses = await Course.findAll({
            where: { Department_ID: newDeptId },
            attributes: ['Course_ID', 'Title'],
            transaction: pool
        });
        console.log(`當前學期為 ${currentSemester}`);

        if (newDeptCourses.length > 0) {
            console.log(`新系所 ${newDeptId} 的必修課程數量：${newDeptCourses.length}`);
            for (const course of newDeptCourses) {
                const enrollment = await Enrollment.findOne({
                    where: {
                        Student_ID: studentId,
                        Course_ID: course.Course_ID,
                        Semester_ID: currentSemester
                    },
                    transaction: pool
                });
                if (!enrollment) {
                    await Enrollment.create({
                        Student_ID: studentId,
                        Course_ID: course.Course_ID,
                        Semester_ID: currentSemester,
                        Status: '轉系加選',
                        Enrollment_Date: new Date()
                    }, { transaction: pool });
                    console.log(`- 成功加選課程 ${course.Title}`);
                } else {
                    console.log(`學生已選修過新系所 ${newDeptId} 的課程 ${course.Title}`);
                }
            }
            console.log(`新系所 ${newDeptId} 必修課程加選處理完成`);
        } else {
            console.log(`新系所 ${newDeptId} 沒有必修課程，跳過加選處理`);
        }
        await pool.commit();
        console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
    } catch (err) {
        await pool.rollback();
        console.error('\n轉系處理失敗：', err);
    } finally {
        console.log(`--- 轉系流程結束 ---`);
        await sequelize.close();
    }
}

// 執行轉系功能（範例）
transferStudent('S10811005', 'EE001', 'CS001');
