const server = require('./index');
(async () => {
    await server.setup(true)
    await server.start(true)
})()