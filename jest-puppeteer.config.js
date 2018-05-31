module.exports = {
    server: {
        launchTimeout: 99999999,
        command: `
            ./node_modules/.bin/webpack;
            ./node_modules/.bin/http-server -p 3333 dist`,
        port: 3333,
    },
}
