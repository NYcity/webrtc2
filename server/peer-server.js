var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9000,
    path: '/peerjs',
    ssl: {
        key: fs.readFileSync('./../certificates/privkey.pem', 'utf8'),
        cert: fs.readFileSync('./../certificates/cert.pem', 'utf8')
        // key: fs.readFileSync('/etc/letsencrypt/live/englishtimeplus.o-r.kr/privkey.pem', 'utf8'),
        // cert: fs.readFileSync('/etc/letsencrypt/live/englishtimeplus.o-r.kr/cert.pem', 'utf8')

    }
});