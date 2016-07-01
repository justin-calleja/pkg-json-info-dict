var assert = require('chai').assert;
var path = require('path');
var pkgJSONOps = require('../lib').pkgJSONOps;
var constants = require('../lib').constants;

var packageA = require('./fixtures/pkgJSONOps/packageA.json');

describe('pkgJSONOps', function() {
  describe('reduceDependencies', function() {
    it('is able to iterate over all dependencies', function () {
      var result = pkgJSONOps.reduceDependencies(packageA, (acc, depName, ofType) => {
        acc.push({
          dependentName: packageA.name,
          dependencyName: depName,
          versionRange: pkgJSONOps.versionRange(depName, ofType, packageA),
          depType: ofType
        });
        return acc;
      }, []);
      assert.equal(result.length, 8, 'expecting 8 dependencies in packageA.json');
      var asyncDep = result.filter(el => el.dependencyName === 'async')[0];
      assert.equal(asyncDep.versionRange, '^2.0.0-rc.6');
      assert.equal(asyncDep.depType, constants.DEPENDENCIES);
    });
  });
});
