var Parser = function () {};

/**
 * Parse incoming OSP packet to JavaScript object
 * @param {buffer} buffer OSP packet
 */
Parser.parse = function (buffer) {
    if (buffer.length <= 1) {
        return;
    }
    var firstByte = buffer.readUInt8(0);
    var obj = {
        type: (firstByte & 0xF0) >> 4,
        isCached: (firstByte & 0x08) === 1,
        isSaved: (firstByte & 0x04) === 1,
        isAcknowledgeRequired: (firstByte & 0x02) === 1,
        hasCrc: (firstByte & 0x01) === 1,
        date: new Date().getTime()
    };
    var headerLength = 1;
    var multiplier = 1;
    var value = 0;
    var nextByteIndex = 1;
    do {
        var digit = buffer.readUInt8(nextByteIndex);
        value += (digit & 127) * multiplier;
        multiplier *= 128;
        nextByteIndex += 1;
        headerLength += 1;
    } while((digit & 128) != 0);
    obj.length = value - headerLength;
    obj.packetLength = value;
    if ( obj.hasCrc ) {
        var calculatedCrc = 0;
        obj.crc = buffer.readUInt8(nextByteIndex + obj.length - 1);
        obj.length -= 1;
        for( var i = nextByteIndex; i < obj.packetLength - 1; ++i ) {
            calculatedCrc = (calculatedCrc + buffer.readUInt8(i)) % 255;
        }
        obj.validData = calculatedCrc === obj.crc;
        !obj.validData && (obj.calculatedCrc = calculatedCrc);
    }
    obj.data = buffer.slice(nextByteIndex, nextByteIndex + obj.length);
    return obj;
};

module.exports.parse = Parser.parse;