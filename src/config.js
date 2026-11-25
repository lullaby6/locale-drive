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
    .option('max-upload', {
        alias: 'm',
        type: 'number',
        description: 'Max size per uploaded file in MB (0 = unlimited)',
        default: 0,
    })
    .option('open', {
        type: 'boolean',
        description: 'Open the browser on start (use --no-open to disable)',
        default: true,
    })
    .help()
    .argv;

const port = argv.port || 3000;

const storagePath = argv.storage;

const maxUploadBytes = argv.maxUpload > 0 ? Math.floor(argv.maxUpload * 1024 * 1024) : 0;

const openBrowser = argv.open;

export { port, storagePath, maxUploadBytes, openBrowser };
