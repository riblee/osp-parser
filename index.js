var Events = require('events');
var net = require('net');
var _ = require('underscore');

var parse = require('./lib/parse').parse;

var opt = {};
var defaultConfig = {
    port: 8080,
    host: '0.0.0.0'
};

/**
 *
 * @param {object} [options] Options for server
 * @param {number} [options.port=8080] Listening port for the server
 * @param {string} [options.host=0.0.0.0] Listening host for the server
 * @constructor
 */
var Osp =  function (options) {
    opt = _.extend(defaultConfig, options);
    Events.EventEmitter.call(this);
    var self = this;

    net.createServer(function (socket) {
        self.emit('tcpConnect', socket);

        socket.on('data', function(data) {
            self.emit('message', parse(data));
        });

        socket.on('close', function() {
            self.emit('end');
        });

    }).listen(opt.port, opt.host);
};

Osp.prototype = Object.create(Events.EventEmitter.prototype);

module.exports = Osp;