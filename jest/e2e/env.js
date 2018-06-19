const fs = require('fs')
const dotenv = require('dotenv')

const envConfig = dotenv.parse(fs.readFileSync('./.env.common'))
const ownEnvConfig = dotenv.parse(fs.readFileSync('./.env'))
const e2eConfig = dotenv.parse(fs.readFileSync('./.env.e2e'))
process.env = {
    ...process.env,
    ...envConfig,
    ...ownEnvConfig,
    ...e2eConfig,
}
