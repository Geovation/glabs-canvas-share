//replaces $ENV with the process.env.ENV
var through = require('through2');

module.exports = function (file) {
    return through(function (buf, enc, next) {
        this.push(buf.toString('utf8').replace(/\$ENV/g, process.env.ENV));
        next();
    });
};