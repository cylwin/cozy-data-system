// Generated by CoffeeScript 1.9.2
var client;

client = require('../lib/indexer');

module.exports.bank = function(req, res, next) {
  var err, path;
  if ((req.body.login != null) && (req.body.password != null)) {
    path = "connectors/bank/" + req.params.name + "/";
    return client.post(path, req.body, function(err, response, body) {
      if (err) {
        return next(err);
      } else if (response == null) {
        return next(new Error("Response not found"));
      } else if (response.statusCode !== 200) {
        return res.send(response.statusCode, body);
      } else {
        return res.send(200, body);
      }
    });
  } else {
    err = new Error("Login and password fields missing in request's body.");
    err.status = 400;
    return next(err);
  }
};

module.exports.bankHistory = function(req, res, next) {
  var err, path;
  if ((req.body.login != null) && (req.body.password != null)) {
    path = "connectors/bank/" + req.params.name + "/history/";
    return client.post(path, req.body, function(err, response, body) {
      if (err) {
        return next(err);
      } else if (response == null) {
        return next(new Error("Response not found"));
      } else if (response.statusCode !== 200) {
        return res.send(response.statusCode, body);
      } else {
        return res.send(200, body);
      }
    });
  } else {
    err = new Error("Login and password fields missing in request's body.");
    err.status = 400;
    return next(err);
  }
};
