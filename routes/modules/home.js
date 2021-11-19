const express = require('express')
const router = express.Router()

const Account = require('../../models/account')

router.get('/', async (req, res) => {
  // 檢查 cookie
  if (req.signedCookies.email) {
    // 從 cookie裡讀取 email
    const email = req.signedCookies.email
    console.log('已簽章Cookies =>', req.signedCookies)
    try {
      const account = await Account.findOne({ email })
        .lean()
      // 判斷帳戶
      if (account) {
        console.log(`${account.firstName} 用Cookie登入`)
        res.render('welcome', { firstName: account.firstName })
      } else {
        res.render('index')
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    res.render('index')
  }
})

// email 格式，與前端一致
const emailPattern = /[^@\s]+@[^@\s]+\.[^@\s]+/

// 讀取帳號密碼
router.post('/', async (req, res) => {
  const { email, password } = req.body
  let [emailError, emailValid, emailFormat, passwordError] = [false, false, false, false]
  // 先處理帳號格式錯誤情況
  if (!emailPattern.test(email)) {
    // 開啟email錯誤提示，提示內容切換為格式錯誤
    [emailError, emailFormat] = [true, true]
    res.render('index', { email, emailError, emailFormat })
  } else {
    // 帳號格式正確
    try {
      // 搜尋帳號
      const account = await Account
        .findOne({ email })
        .lean()

      // 帳號不存在，account 回傳為 null
      if (!account) {
        // 開啟email錯誤提示，提示內容切換為帳號未註冊
        [emailError, emailFormat] = [true, false]
        res.render('index', { email, emailError, emailFormat })
      } else if (account.password !== password) {
        // 帳號存在，密碼錯誤
        [emailValid, passwordError] = [true, true]
        res.render('index', { email, emailValid, passwordError })
      } else {
        // 定義 cookie選項參數
        const cookieOption = {
          //  cookie只能經由http(s)協定來存取，防JavaScript存取使用者的 session cookie
          httpOnly: true,
          // 已取代 expires屬性，單位毫秒
          maxAge: 3 * 60 * 1000,
          // 啟用簽章
          signed: true
        }
        // 建立cookie
        res.cookie('email', email, cookieOption)
        res.render('welcome', { firstName: account.firstName })
        console.log(`已建立 cookie=>email:${email}`)
      }
    } catch (error) {
      console.error(error)
    }
  }
})

// 清除cookie，登出
router.get('/logout', (req, res) => {
  res.clearCookie('email')
  res.redirect('/')
  console.log('已清除 Cookie')
})

module.exports = router
