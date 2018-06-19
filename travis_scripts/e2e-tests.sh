sudo /etc/init.d/mysql stop
git clone https://github.com/streamr-dev/streamr-docker-dev.git
$TRAVIS_BUILD_DIR/streamr-docker-dev/streamr-docker-dev/bin.sh start 1
sleep(1000)
$TRAVIS_BUILD_DIR/streamr-docker-dev/streamr-docker-dev/bin.sh engine-and-editor

while ()
do

done

NODE_ENV=e2e npm run build
npm run test-e2e