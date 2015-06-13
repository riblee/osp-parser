var Osp = require('./index');
var osp = new Osp();

// Add plugin to handle packets with type 8
osp.plugin(8, function (packet, socket) {
    console.log('Handler called for type 8 packet from: ' + socket.remoteAddress);

    // Modify packet and/or data here

    return packet;
});

// Add plugin to handle packets with type 2
osp.plugin(2, function (packet, socket) {
    console.log('Handler called for type 2 packet with data: ' + JSON.stringify(packet.data));
    if (packet.data.length < 2) {
        console.log('Error');
    }
    console.log('The device sent a response to COMMAND packet. CommandID: ' + packet.data.readUInt8(0) +
        ' Exit code: ' + packet.data.readUInt8(1));

    return packet;
});

osp.on('tcpConnect', function (socket) {
    console.log('TCP connection from: ' + socket.remoteAddress +':'+ socket.remotePort);
});

osp.on('message', function (packet, socket) {
    console.log('Received packet with type ' + packet.type + ' from ' + socket.remoteAddress);
});

osp.on('tcpDisConnect', function () {
    console.log('TCP connection closed.');
});