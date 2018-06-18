const axios = require('axios')

const logMessage = (e) => console.debug(e.message)
const defaultOptions = {
    headers: {
        Authorization: `Token ${process.env.TESTER1_KEY}`,
    }
}

module.exports = {
    postRequest: (url, data = {}, options = defaultOptions) => axios.post(`${process.env.API_URL}/${url}`, data, options).then(r => r.data).catch(logMessage),
    getRequest: (url, options = defaultOptions) => axios.get(`${process.env.API_URL}/${url}`, options).then(r => r.data).catch(logMessage),
}
