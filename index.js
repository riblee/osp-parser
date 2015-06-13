var Events = require('events');
var net = require('net');
var _ = require('underscore');

var parse = require('./lib/parse').parse;

var opt = {};
var defaultConfig = {
    port: 8080,
    host: '0.0.0.0'
};
var plugins = [];

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
            var parsedData = parse(data);

            if (plugins[parsedData.type]) {
                parsedData = plugins[parsedData.type](parsedData, socket);
            }

            self.emit('message', parsedData, socket);
        });

        socket.on('close', function() {
            self.emit('tcpDisConnect');
        });

    }).listen(opt.port, opt.host);
};

Osp.prototype = Object.create(Events.EventEmitter.prototype);

/**
 * Set a handler function to specified data type and returns it
 * If handler is not specified returns with registered one
 * @param {number} dataType The data type that the handler can parse
 * @param {function} [handler] The handler function to data type
 * @returns {*} The processed object
 */
Osp.prototype.plugin = function (dataType, handler) {
    if (handler) {
        plugins[dataType] = handler;
    }

    return plugins[dataType];
};

module.exports = Osp;