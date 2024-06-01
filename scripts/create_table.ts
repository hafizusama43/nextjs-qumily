async function createCampaignTable(client) {
    try {

        // -- Create templates table
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS campaign_templates (
            campaign_templates_id SERIAL PRIMARY KEY, 
            camping_name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL, 
            created_by VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;

        console.log(`Created "campaign_templates" table`);

        return createTable;

    } catch (error) {
        console.error('Error creating "campaign_templates" table.:', error);
        throw error;
    }
}

module.exports = {
    createCampaignTable
}


