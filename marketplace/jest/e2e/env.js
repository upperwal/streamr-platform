const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.././.env.common')))
const ownEnvConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.././.env')))
const e2eConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.././.env.e2e')))
process.env = {
    ...process.env,
    ...envConfig,
    ...ownEnvConfig,
    ...e2eConfig,
}
