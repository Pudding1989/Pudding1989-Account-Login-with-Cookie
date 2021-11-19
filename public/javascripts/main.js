const emailInput = document.querySelector('#email-input')
const passwordInput = document.querySelector('#password-input')
const submitBtn = document.querySelector('.sign-in')

const emailHint = document.querySelector('.email-hint')
const passwordHint = document.querySelector('.password-hint')
const emailText = document.querySelector('.email-text')
const passwordText = document.querySelector('.password-text')

// email 格式規則
const emailPattern = /[^@\s]+@[^@\s]+\.[^@\s]+/

// 啟用 submit按鈕
const check = {
  email: false,
  password: false
}

// 即時監聽 email
emailInput.addEventListener('input', (event) => {
  // 清除狀態
  cleanValid(emailInput, emailHint)

  // 取email格式input值，有trim()效果
  // 檢查email格式
  emailFormat()
  // 切換 submit button 狀態
  btnToggle()
})

// 失去焦點，才判斷 email錯誤狀態
emailInput.addEventListener('change', (event) => {
  const email = event.target.value

  if (email && !emailPattern.test(email)) {
    // 輸入框錯誤提示
    invalidHint(emailInput, emailHint, emailText, '信箱格式錯誤')
  }
})

// 即時監聽 password
passwordInput.addEventListener('input', (event) => {
  // 清除狀態
  cleanValid(passwordInput, passwordHint)

  // 對應router回傳email正確，密碼錯誤時，按鈕無法被開啟
  // 在密碼輸入時，判斷 email格式
  emailFormat()

  const password = event.target.value
  if (password.match(/ /g)) {
    invalidHint(passwordInput, passwordHint, passwordText, '密碼不可包含空白')
  }

  if (password.trim().length >= 8) {
    check.password = true
  } else {
    check.password = false
  }

  // 切換 submit button 狀態
  btnToggle()
})

// 失去焦點，才判斷 password 錯誤狀態
passwordInput.addEventListener('change', (event) => {
  const password = event.target.value
  console.log(password)
  // passwordInput.value = password // 自動修正前後空白

  if (password && password.length < 8) {
    invalidHint(passwordInput, passwordHint, passwordText, '密碼至少為8個字元')
  }
})

function emailFormat () {
  // 取email格式input值，有trim()效果
  const email = emailInput.value
  if (emailPattern.test(email)) {
    emailInput.classList.add('is-valid')
    check.email = true
  } else {
    check.email = false
  }
}

// 清除 input 狀態
function cleanValid (input, hint) {
  input.classList.remove('is-valid')
  input.classList.remove('is-invalid')
  hint.classList.remove('visible')
}

// 顯示 input 錯誤狀態
function invalidHint (input, hint, hintText, hintMessage) {
  hintText.innerText = hintMessage
  input.classList.add('is-invalid')
  hint.classList.add('visible')
}

// 切換 submit button 狀態
function btnToggle () {
  if (check.email && check.password) {
    submitBtn.classList.remove('btn-secondary')
    submitBtn.classList.add('btn-primary')
    submitBtn.disabled = false
  } else {
    submitBtn.classList.remove('btn-primary')
    submitBtn.classList.add('btn-secondary')
    submitBtn.disabled = true
  }
}
