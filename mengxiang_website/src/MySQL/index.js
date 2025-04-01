import mysql from 'mysql2/promise'

export const MysqlConnect = async () => {
  const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mengxiang_website',
  })
  try {
    await db.query('SELECT * FROM user')
    console.log('连接成功')
    return db
  } catch (err) {
    console.error('连接失败:', err.message)
    throw err
  }
}
