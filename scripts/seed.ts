// const DbConnect = require('../config/db.ts');
// const { createCampaignTable, createCampaignTemplateDataTable } = require('./create_table.ts');

import DbConnect from "@/config/db";

async function main() {
    try {
        const client = await DbConnect();

        // await createCampaignTable(client);
        // await createCampaignTemplateDataTable(client);

        await client.end();
    } catch (err) {
        console.error('An error occurred while attempting to seed the database:', err);
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err);
});
