// Generated by CoffeeScript 1.9.2
var S, errors, fs, http, initLoginCouch, log, querystring, releaseStream;

http = require('http');

fs = require('fs');

querystring = require('querystring');

S = require('string');

errors = require('../middlewares/errors');

log = require('printit')({
  date: true,
  prefix: 'downloader'
});

initLoginCouch = function(callback) {
  var data;
  return data = fs.readFile('/etc/cozy/couchdb.login', function(err, data) {
    var lines;
    if (err) {
      return callback(err);
    } else {
      lines = S(data.toString('utf8')).lines();
      return callback(null, lines);
    }
  });
};

releaseStream = function(stream) {
  stream.on('data', function() {});
  stream.on('end', function() {});
  return stream.resume();
};

module.exports = {
  download: function(id, attachment, rawcallback) {
    var abortable, aborted, callback, dbName, path, request;
    dbName = process.env.DB_NAME || 'cozy';
    attachment = querystring.escape(attachment);
    path = "/" + dbName + "/" + id + "/" + attachment;
    aborted = false;
    request = null;
    callback = function(err, stream) {
      rawcallback(err, stream);
      return callback = function() {};
    };
    initLoginCouch(function(err, couchCredentials) {
      var basic, credentialsBuffer, options, pwd;
      if (err && process.NODE_ENV === 'production') {
        return callback(err);
      }
      if (aborted) {
        return callback(new Error('aborted'));
      }
      options = {
        host: process.env.COUCH_HOST || 'localhost',
        port: process.env.COUCH_PORT || 5984,
        path: path
      };
      if (!err && process.env.NODE_ENV === 'production') {
        id = couchCredentials[0];
        pwd = couchCredentials[1];
        credentialsBuffer = new Buffer(id + ":" + pwd);
        basic = "Basic " + (credentialsBuffer.toString('base64'));
        options.headers = {
          Authorization: basic
        };
      }
      request = http.get(options, function(res) {
        var msg;
        if (res.statusCode === 404) {
          callback(errors.http(404, 'Not Found'));
          return releaseStream(res);
        } else if (res.statusCode !== 200) {
          msg = err.message;
          err = callback(new Error("error occured while downloading attachment " + msg + " "));
          err.status = res.statusCode;
          callback(err);
          return releaseStream(res);
        } else {
          return callback(null, res);
        }
      });
      return request.on('error', callback);
    });
    return abortable = {
      abort: function() {
        aborted = true;
        if (request != null) {
          request.abort();
        }
        return callback(new Error('aborted'));
      }
    };
  }
};
