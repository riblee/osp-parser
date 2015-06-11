var Osp = require('./index');
var osp = new Osp();

osp.on('tcpConnect', function (socket) {
    console.log('TCP connection from: ' + socket.remoteAddress +':'+ socket.remotePort);
});

osp.on('message', function (data) {
    console.log(JSON.stringify(data, null, 4));
});

osp.on('end', function () {
    console.log('end');
});