var assert = require('chai').assert;
var path = require('path');
var readDirectoryNamesInPath = require('../lib/readers').readDirectoryNamesInPath;
var readDirectoryNamesInPathSync = require('../lib/readers').readDirectoryNamesInPathSync;

var fixturesPath = path.join(__dirname, 'fixtures');

describe('readers', function() {
  describe('readDirectoryNamesInPath', function() {
    it('does not throw exception when given directories that do not exist', function (cb) {
      readDirectoryNamesInPath(path.join(fixturesPath, 'doesnotexist'), (err, result) => {
        assert.isArray(result, 'expecting result to be an array');
        assert.equal(result.length, 0, 'expecting empty array');
        cb();
      });
    });
  });
  describe('readDirectoryNamesInPathSync', function() {
    it('does not throw exception when given directories that do not exist', function () {
      var result = readDirectoryNamesInPathSync(path.join(fixturesPath, 'doesnotexist'));
      assert.isArray(result, 'expecting result to be an array');
      assert.equal(result.length, 0, 'expecting empty array');
    });
  });
});
