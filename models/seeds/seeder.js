const dataBase = require('../../config/mongoose')

// models
const Account = require('../account')
const seeds = require('../seeds/seedData')

dataBase.once('open', async () => {
  console.log('Seeder connect to MongoDB ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡ ')

  try {
    await Account.insertMany(seeds)

    console.log('播種完畢 <(￣︶￣)>')
    process.exit()
  } catch
  (error) { console.log(`DataBase ERROR at insertMany Function:${error}`) }
})
