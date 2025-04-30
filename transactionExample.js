// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易
    
    const input = "S10811005";

    // 假設要同時將學生 'S10810005' 的系所由 CS001 換成 EE001
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    const update = await conn.query(updateStudent, ['EE001', input]);
    if (update.affectedRows <= 0) {
        console.log('更新失敗');
        return;
    }
        
    // 如果以上操作都成功，則提交交易
    await conn.commit();
    console.log('交易成功，已提交');

    const sql = 'SELECT Student_ID,Department_ID FROM STUDENT WHERE Student_ID = ?';
    const rows = await conn.query(sql, [input]);
    console.log('查詢結果：', rows);

  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
