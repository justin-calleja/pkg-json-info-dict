var assert = require('chai').assert;
var path = require('path');
var pkgJSONInfoDict = require('../lib').pkgJSONInfoDict;
var pkgJSONInfoDictSync = require('../lib').pkgJSONInfoDictSync;

var fixturesPath = path.join(__dirname, 'fixtures');
var paths = [path.join(fixturesPath, 'dir1'), path.join(fixturesPath, 'doesnotexist'), path.join(fixturesPath, 'dir2')];

require('./directoryNamesInPath-test');

describe('pkgJSONInfoDict module', function() {
  it('pkgJSONInfoDict async:', function (cb) {
    pkgJSONInfoDict(paths, (err, result) => {
      assert.equal(Object.keys(result).length, 7, 'expecting 7 keys in result');
      assert.property(result, 'a', 'expecting an entry for package a');
      assert.property(result.a, 'absPath');
      assert.property(result.a, 'pkgJSON');
      assert.property(result, 'b', 'expecting an entry for package b');
      assert.property(result.b, 'absPath');
      assert.property(result.b, 'pkgJSON');
      assert.property(result, 'c', 'expecting an entry for package c');
      assert.property(result.c, 'absPath');
      assert.property(result.c, 'pkgJSON');
      assert.property(result, 'd', 'expecting an entry for package d');
      assert.property(result.d, 'absPath');
      assert.property(result.d, 'pkgJSON');
      assert.property(result, 'e', 'expecting an entry for package e');
      assert.property(result.e, 'absPath');
      assert.property(result.e, 'pkgJSON');
      assert.property(result, 'f', 'expecting an entry for package f');
      assert.property(result.f, 'absPath');
      assert.property(result.f, 'pkgJSON');
      assert.property(result, 'g', 'expecting an entry for package g');
      assert.property(result.g, 'absPath');
      assert.property(result.g, 'pkgJSON');

      cb();
    });
  });
});
