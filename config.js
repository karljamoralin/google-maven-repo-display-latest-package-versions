var env = process.env.NODE_ENV || 'dev'

if (env === 'dev') {
  process.env.PORT = 3000
}