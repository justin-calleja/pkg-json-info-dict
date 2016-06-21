var assert = require('chai').assert;
var path = require('path');
var directoryNamesInPath = require('../lib/directoryNamesInPath').directoryNamesInPath;

var fixturesPath = path.join(__dirname, 'fixtures');

require('./directoryNamesInPath-test');

describe('directoryNamesInPath', function() {
  it('works with directories that do not exist', function (cb) {
    directoryNamesInPath(path.join(fixturesPath, 'doesnotexist'), (err, result) => {
      assert.isArray(result, 'expecting result to be an array');
      assert.equal(result.length, 0, 'expecting empty array');
      cb();
    });
  });
});
