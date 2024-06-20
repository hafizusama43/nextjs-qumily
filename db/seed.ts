const DbConnect = require('.');
const { createCampaignTemplateTable,
    createCampaignTable,
    createCampaignTemplateDataTable,
    createCampaignDataTable,
} = require('./.ts');

async function main() {
    try {
        const client = await DbConnect();

        await createCampaignTemplateTable(client)
        await createCampaignTable(client);
        await createCampaignTemplateDataTable(client);
        await createCampaignDataTable(client)

        await client.end();
    } catch (err) {
        console.error('An error occurred while attempting to seed the database:', err);
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err);
});
