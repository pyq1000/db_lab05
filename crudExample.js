// crudExample.js
const pool = require('./db');

async function basicCrud() {
    let conn;
    try {
        conn = await pool.getConnection();

        // 1. INSERT 新增'
        const input = "S10810001";
        sql = 'SELECT * FROM STUDENT WHERE Student_ID = ?';
        const row = await conn.query(sql, [input]);
        if (row.length <= 0) {
            let sql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
            await conn.query(sql, [input, '王曉明', 'M', 'wang@example.com', 'CS001']);
            console.log('已新增一筆學生資料');            
        } else {
            console.log('已有該學號');
        }

        // 2. SELECT 查詢
        sql = 'SELECT * FROM STUDENT WHERE Student_ID = ?';
        const rows = await conn.query(sql, ['S10811001']);
        if (rows.length <= 0) {
            console.log('查無該學號的學生資料');
            return;
        }
        console.log('查詢結果：', rows);

        // 3. UPDATE 更新
        sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
        const update = await conn.query(sql, ['王大明', 'S10811001']);
        if (update.affectedRows <= 0) {
            console.log('更新失敗');
            return;
        }
        console.log('已更新學生名稱');

        // 4. DELETE 刪除
        sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
        const deleteResult = await conn.query(sql, ['S10810001']);
        if (deleteResult.affectedRows <= 0) {
            console.log('刪除失敗');
            return;
        }
        console.log('已刪除該學生');


    } catch (err) {
        console.error('操作失敗：', err);
    } finally {
        if (conn) conn.release();
    }
}

basicCrud();
