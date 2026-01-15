import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listTables() {
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        console.error('❌ Error fetching tables:', error);
        // Try another way if information_schema is not accessible via RPC/Rest
        const { data: data2, error: error2 } = await supabase.rpc('get_tables');
        if (error2) {
            console.log('Trying direct query on known tables...');
            const tables = ['posts', 'landing_pages', 'settings', 'menu', 'content_items', 'items'];
            for (const table of tables) {
                const { count, error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true });
                if (tableError) {
                    console.log(`❌ Table "${table}" not found or error: ${tableError.message}`);
                } else {
                    console.log(`✅ Table "${table}" exists with ${count} records.`);
                }
            }
        } else {
            console.log('Tables:', data2);
        }
    } else {
        console.log('Tables:', data);
    }
}

listTables();
