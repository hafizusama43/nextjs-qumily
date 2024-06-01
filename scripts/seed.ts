const tables = require('./create_table.ts');

const { db } = require('@vercel/postgres');
// const bcrypt = require('bcryptjs');

async function main() {
    const client = await db.connect();

    const { createCampaignTable } = tables;

    await createCampaignTable(client);
    // await seedCustomers(client);
    // await seedInvoices(client);
    // await seedRevenue(client);

    await client.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});