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
        isCached: firstByte & 0x08,
        isSaved: firstByte & 0x04,
        isAcknowledgeRequired: firstByte & 0x02
    };
    var multiplier = 1;
    var value = 0;
    var nextByteIndex = 1;
    do{
        var digit = buffer.readUInt8(nextByteIndex);
        value += (digit & 127) * multiplier;
        multiplier *= 128;
        nextByteIndex += 1;
    } while((digit & 128) != 0);
    obj.length = value;
    obj.data = buffer.slice(nextByteIndex);
    return obj;
};

module.exports.parse = Parser.parse;