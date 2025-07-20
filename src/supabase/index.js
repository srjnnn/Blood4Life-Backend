import config from '../configs/index.js';
import { createClient } from '@supabase/supabase-js';

class SupaClient {
    constructor() {
        this.client = createClient(config.supabaseUrl, config.supabaseKey);
    }
}

export default new SupaClient().client;