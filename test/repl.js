// NOTE: repl.js depends on tsc output.
// Make sure you've transpiled with `npm run build` before using: node ./test/repl.js
var repl = require('repl');
var path = require('path');
var pkgJSONInfoDict = require('../lib').pkgJSONInfoDict;
var directoryNamesInPath = require('../lib/directoryNamesInPath').default;

var replServer = repl.start({
  prompt: '> '
});

replServer.context.pkgJSONInfoDict = pkgJSONInfoDict;
replServer.context.directoryNamesInPath = directoryNamesInPath;
var fixturesPath = replServer.context.fixturesPath = path.resolve(__dirname, './fixtures');
replServer.context.dir1 = path.join(fixturesPath, 'dir1');
replServer.context.dir2 = path.join(fixturesPath, 'dir2');
var dirsInFixtures;
directoryNamesInPath(fixturesPath, (err, dirNames) => {
  dirsInFixtures = dirNames.map(dirName => path.join(fixturesPath, dirName));
  replServer.context.dirsInFixtures = dirsInFixtures;
});
// export function pkgJSONInfoDict(paths:string[], pkgJSONInfoDictCb: (err: Error, result?: PkgJSONInfoDict) => any): any {
