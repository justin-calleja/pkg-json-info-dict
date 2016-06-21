import * as fs from 'fs';
import { join } from 'path';
import { filterLimit } from 'async';
import asyncOpsLimit from './asyncOpsLimit';

export function directoryNamesInPathSync(absPath: string): string[] {
  return fs.readdirSync(absPath).filter((file) => fs.statSync(join(absPath, file)).isDirectory());
}

export function directoryNamesInPath(absPath: string, getDirectoriesCb: (err: Error, dirNames?: string[]) => void) {
  fs.readdir(absPath, (err, files: string[]) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // if path doesn't exist, it's not an error, just return []
        getDirectoriesCb(null, []);
        return;
      }
      getDirectoriesCb(err);
      return;
    }
    filterLimit(files, asyncOpsLimit, function truthTest(file: string, truthTestCb: (err, truthValue: boolean) => void): void {
      fs.stat(join(absPath, file), (statErr, stats: fs.Stats) => {
        if (statErr) {
          truthTestCb(statErr, false);
          return;
        }
        truthTestCb(null, stats.isDirectory());
      });
    }, function filteringDoneCb(filteringError, dirNames: string[]) {
      if (filteringError) {
        getDirectoriesCb(filteringError);
        return;
      }
      getDirectoriesCb(null, dirNames);
    });
  });
}
