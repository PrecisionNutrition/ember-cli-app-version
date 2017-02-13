/* global module, require */
/* jshint node:true, eqnull:true */
'use strict';
var fs = require('fs');

var path       = require('path');
var getGitInfo = require('git-repo-info');

var getVersion = function(shaLength, root) {
  var projectPath = root || process.cwd();
  var packageVersion  = require(path.join(projectPath, 'package.json')).version;
  var info = getGitInfo(projectPath);

  var sha = info.sha || '';
  var prefix;

  if (packageVersion != null) {
    prefix = packageVersion;
  } else if (info.branch) {
    prefix = info.branch;
  } else {
    prefix = 'DETACHED_HEAD';
  }

  return prefix + '+' + sha.slice(0, shaLength || 8);
};

module.exports = {
  name: 'ember-cli-app-version',
  config: function(env, baseConfig) {
    var config = this._super.config.apply(this, arguments);

    var version = getVersion(null, this.project.root);
    if (version && baseConfig.APP) {
      baseConfig.APP.name = this.project.pkg.name;
      baseConfig.APP.version = version;
    }

    return config;
  }
};
