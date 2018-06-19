require('../env')
require('./ganache').start()
require('./express').start()
require('./express').stop()
