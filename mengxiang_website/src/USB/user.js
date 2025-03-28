import express from 'express'
import cors from 'cors'
import { MysqlConnect } from '../MySQL/index.js'
import bcrypt from 'bcryptjs'

const db = await MysqlConnect()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
  // status 默认是 0 表示失败的情况
  res.cc = (err, status = 0) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 注册
app.post('/register', async (req, res) => {
  if (req.body.account === '' || req.body.password === '') {
    return res.cc('用户名或密码不能为空')
  }
  const sql1 = `select * from user where account = '${req.body.account}'`
  req.body.password = bcrypt.hashSync(req.body.password, 10)
  const sql2 = `insert into user values ('${req.body.account}', '${req.body.password}')`
  const [rows] = await db.query(sql1)
  if (rows.length > 0) {
    return res.cc('用户名已存在')
  }
  const [rows2] = await db.query(sql2)
  if (rows2.affectedRows !== 1) {
    return res.cc('注册失败')
  } else {
    return res.cc('注册成功', 1)
  }
})
// 登录
app.post('/login', async (req, res) => {
  if (req.body.account === '' || req.body.password === '') {
    return res.cc('用户名或密码不能为空')
  }
  const sql = `select password from user where account = '${req.body.account}'`
  const [rows] = await db.query(sql)
  if (rows.length === 0) {
    return res.cc('用户名或密码错误')
  } else {
    const password = rows[0].password
    const compareResult = bcrypt.compareSync(req.body.password, password)
    if (!compareResult) {
      return res.cc('用户名或密码错误')
    } else {
      return res.cc('登录成功', 1)
    }
  }
})

app.listen(8080, () => {
  console.log('http://localhost:8080')
})
