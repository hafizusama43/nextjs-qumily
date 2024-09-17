import { PgSqlPool } from './db.mjs';
import {
    createCampaignTemplateTable,
    createCampaignTable,
    createCampaignTemplateDataTable,
    createCampaignDataTable,
} from './create_table.mjs';

async function main() {
    let client;
    try {
        client = await PgSqlPool();

        await createCampaignTemplateTable(client);
        // await createCampaignTable(client);
        // await createCampaignTemplateDataTable(client);
        // await createCampaignDataTable(client);

        console.info('Database seeding completed.');
    } catch (err) {
        console.error('An error occurred while attempting to seed the database:', err);
    } finally {
        if (client && typeof client.end === 'function') {
            // For connection pooling, manually close the pool
            try {
                await client.end();
                console.info('Connection pool closed.');
            } catch (endErr) {
                console.error('Error closing the connection pool:', endErr);
            }
        }
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err);
});
