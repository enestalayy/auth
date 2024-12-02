const mongoose = require('mongoose')
const { env, mongoDB_URI } = require('./config')

const connectionString = mongoDB_URI || 'mongodb://localhost:27017/auth'

// Mongoose global ayarları
mongoose.set('debug', env === 'development') // Yalnızca geliştirme ortamında debug açık
mongoose.set('strictQuery', true) // Yeni Mongoose uyarıları için önerilir

const mongoDBConnection = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(connectionString)
    console.log('✔️  Database Connection Established.')
  } catch (error) {
    console.error('❌  Database Connection Failed:', error.message)
    process.exit(1) // Uygulamayı güvenli bir şekilde sonlandır
  }
}

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('🛑  Mongoose connection closed due to app termination.')
  process.exit(0)
})

module.exports = { mongoDBConnection }
