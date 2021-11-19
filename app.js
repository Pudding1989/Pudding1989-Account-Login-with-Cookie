// 連線資料庫
require('./config/mongoose')

const express = require('express')
const app = express()

// 設定模板引擎
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

// 設定路由功能
const routes = require('./routes')
app.use(express.urlencoded({ extended: true }))
app.use(routes)

// 監聽伺服器
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Express Server listening on http://localhost:${PORT}`)
  console.log('You can press『 ⌃ + C 』to disconnect Express Server')
})
