import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const DEFAULT_PORT = 24680;

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
        description: 'Server port. Without it, the next free port is used if the default one is taken',
        defaultDescription: String(DEFAULT_PORT),
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

/** Uncommon on purpose (not 3000, 5173, 8080...) so it rarely clashes with other apps. */
const port = argv.port ?? DEFAULT_PORT;

/** A port passed with --port is used as is: if it's taken the server stops instead of picking another. */
const portIsExplicit = argv.port !== undefined;

const storagePath = argv.storage;

const maxUploadBytes = argv.maxUpload > 0 ? Math.floor(argv.maxUpload * 1024 * 1024) : 0;

const openBrowser = argv.open;

/** Filled in once the server is listening: the port actually in use (it may differ from `port`). */
const runtime = { port };

export { port, portIsExplicit, runtime, storagePath, maxUploadBytes, openBrowser };
