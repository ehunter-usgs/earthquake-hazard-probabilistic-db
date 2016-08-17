'use strict';

var fs = require('fs'),
    ftp = require('ftp'),
    path = require('path'),
    tar = require('tar'),
    zlib = require('zlib');


var FtpDownloader = function (options) {
  var _this,
      _initialize;


  _this = {
    downloadFile: null
  };

  _initialize = function (options) {
    _this.ftp = new ftp();
    _this.ftp.connect(options.ftp || {});
  };


  _this.downloadFile = function (remoteFile, localDir, options) {
    return new Promise((resolve, reject) => {
      options = options || {};

      _this.ftp.once('ready', () => {
        _this.ftp.get(remoteFile, (err, stream) => {
          if (err) {
            reject(err);
          }

          // Stream transforms ...
          if (options.gzip) {
            stream = stream.pipe(zlib.createGunzip());
          }

          if (options.tar) {
            stream.pipe(new tar.Extract({
              path: fs.realpathSync(localDir)
            }));
          } else {
            stream.pipe(fs.createWriteStream(
                localDir + '/' + path.basename(remoteFile)));
          }

          stream.once('close', () => {
            resolve();
          });
        });
      });
    });
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = FtpDownloader;
