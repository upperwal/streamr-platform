const server = require('./index');
(async () => {
    await server.setup()
    await server.start()
})()