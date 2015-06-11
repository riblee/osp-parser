var Osp = require('./index');
var osp = new Osp();

// Add plugin to handle packets with type 8
osp.plugin(8, function (packet) {
    console.log('Handler called for type 8 packet with data: ' + JSON.stringify(packet.data));

    packet.data.sort(function (a, b) {
        return b-a;
    });

    return packet;
});

// Add plugin to handle packets with type 2
osp.plugin(2, function (packet) {
    console.log('Handler called for type 2 packet with data: ' + JSON.stringify(packet.data));
    if (packet.data.length < 2) {
        console.log('Error');
    }
    console.log('The device sent a response to COMMAND packet. CommandID: ' + packet.data[0] +
        ' Exit code: ' + packet.data[1]);

    return packet;
});

osp.on('tcpConnect', function (socket) {
    console.log('TCP connection from: ' + socket.remoteAddress +':'+ socket.remotePort);
});

osp.on('message', function (data) {
    console.log(JSON.stringify(data, null, 4));
});

osp.on('tcpDisConnect', function () {
    console.log('TCP connection closed.');
});