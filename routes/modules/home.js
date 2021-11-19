const express = require('express')
const router = express.Router()

const Account = require('../../models/account')

router.get('/', (req, res) => {
  res.render('index')
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
        res.render('welcome', { firstName: account.firstName })
      }
    } catch (error) {
      console.error(error)
    }
  }
})

module.exports = router
