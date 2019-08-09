module.exports = {
  port: process.env.PORT || 8086,
  db: {
    database: process.env.DATABASE || 'roomservice',
    user: process.env.DB_USER || 'roomservice',
    password: process.env.DB_PASS || 'roomservice',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './roomservice.sqlite'
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
