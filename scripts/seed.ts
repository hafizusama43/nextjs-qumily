const DbConnect = require('./db.ts');
const { createCampaignTemplateTable, createCampaignTable, createCampaignTemplateDataTable } = require('./create_table.ts');

async function main() {
    try {
        const client = await DbConnect();

        await createCampaignTemplateTable(client)
        await createCampaignTable(client);
        await createCampaignTemplateDataTable(client);

        await client.end();
    } catch (err) {
        console.error('An error occurred while attempting to seed the database:', err);
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err);
});
