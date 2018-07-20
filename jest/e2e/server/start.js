require('../env')

const ganache = require('./ganache')
// const express = require('./express')

ganache.isNotRunning()
    .then((status) => {
        if (status) {
            ganache.start()
        }
    })

// express.isNotRunning()
//     .then((status) => {
//         if (status) {
//             express.start()
//         }
//     })
