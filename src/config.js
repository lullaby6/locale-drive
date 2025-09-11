import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
    .command('$0 [storage]', 'Server start', (yargs) => {
        yargs.positional('storage', {
            describe: 'Storage path',
            type: 'string',
            default: './storage'
        })
    })
    .option('port', {
        alias: 'p',
        type: 'number',
        description: 'Server port',
        default: 3000,
    })
    .help()
    .argv;

const port = argv.port || 3000;

const storagePath = argv.storage;

export { port, storagePath };