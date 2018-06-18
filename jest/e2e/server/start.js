const server = require('./index')

const start = async () => {
    await server.setup()
    await server.start()
}
start()
