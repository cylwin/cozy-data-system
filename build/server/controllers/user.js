// Generated by CoffeeScript 1.9.2
var db, errors, keys, logger;

db = require('../helpers/db_connect_helper').db_connect();

keys = require('../lib/encryption');

logger = require('printit')({
  prefix: 'controllers/user'
});

errors = require('../middlewares/errors');

module.exports.create = function(req, res, next) {
  var ref;
  if ((ref = req.body) != null) {
    delete ref._attachments;
  }
  if (req.params.id) {
    return db.get(req.params.id, function(err, doc) {
      if (doc) {
        return next(errors.http(409, "The document exists"));
      } else {
        return db.save(req.params.id, req.body, function(err, response) {
          if (err) {
            return next(errors.http(409, "The document exists"));
          } else {
            return res.send(201, {
              _id: response.id
            });
          }
        });
      }
    });
  } else {
    return db.save(req.body, function(err, response) {
      if (err) {
        logger.error(err);
        return next(err);
      } else {
        return res.send(201, {
          _id: response.id
        });
      }
    });
  }
};

module.exports.merge = function(req, res, next) {
  var ref;
  if ((ref = req.body) != null) {
    delete ref._attachments;
  }
  return db.merge(req.params.id, req.body, function(err, response) {
    if (err) {
      logger.error(err);
      return next(err);
    } else {
      res.send(200, {
        success: true
      });
      return next();
    }
  });
};
