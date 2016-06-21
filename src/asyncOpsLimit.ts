import { cpus } from 'os';

var asyncOpsLimit = Math.floor(cpus().length / 2);

export default asyncOpsLimit;
