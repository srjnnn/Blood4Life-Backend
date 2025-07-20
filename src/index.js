import 'dotenv/config';
import config from './configs/index.js';
import Server from './server/index.js';
import supaClient from './supabase/index.js';

const port = config.port;
const serverHost = config.serverHost;

const init = async () => {
    try {
        const newServer = new Server(port, serverHost);
        newServer.start();

        console.log('supa client', supaClient);
    } catch (error) {
        console.error('error starting server', error);
    }
};

init();