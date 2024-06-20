const createCampaignTemplateTable = async (client) => {
    try {

        // -- Create templates table
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS campaign_templates (
            campaign_templates_id SERIAL PRIMARY KEY, 
            template_name VARCHAR(255) NOT NULL,
            template_category VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL, 
            created_by VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`, []);

        console.log(`Created "campaign_templates" table`);

        return createTable;

    } catch (error) {
        console.error('Error creating "campaign_templates" table.:', error);
        throw error;
    }
}

const createCampaignTable = async (client) => {
    try {

        // -- Create templates table
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS campaigns (
            campaign_id SERIAL PRIMARY KEY, 
            campaign_name VARCHAR(255) NOT NULL,
            campaign_category VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL, 
            created_by VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`, []);

        console.log(`Created "campaigns" table`);

        return createTable;

    } catch (error) {
        console.error('Error creating "campaigns" table.:', error);
        throw error;
    }
}

const createCampaignTemplateDataTable = async (client) => {
    try {

        // -- Create templates table
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS campaign_templates_data (
            campaign_templates_data_id SERIAL PRIMARY KEY,
            template_id INT,
            product VARCHAR(255) NULL,
            entity VARCHAR(255) NULL,
            operation VARCHAR(255) NULL,
            campaign_id VARCHAR(255) NULL,
            ad_group_id VARCHAR(255) NULL,
            portfolio_id VARCHAR(255) NULL,
            ad_id VARCHAR(255) NULL,
            keyword_id VARCHAR(255) NULL,
            product_targeting_id VARCHAR(255) NULL,
            campaign_name VARCHAR(255) NULL,
            ad_group_name VARCHAR(255) NULL,
            start_date VARCHAR(255) NULL,
            end_date VARCHAR(255) NULL,
            targeting_type VARCHAR(255) NULL,
            state VARCHAR(255) NULL,
            daily_budget VARCHAR(255) NULL,
            sku VARCHAR(255) NULL,
            ad_group_default_bid VARCHAR(255) NULL,
            bid VARCHAR(255) NULL,
            keyword_text VARCHAR(255) NULL,
            match_type VARCHAR(255) NULL,
            bidding_strategy VARCHAR(255) NULL,
            placement VARCHAR(255) NULL,
            percentage VARCHAR(255) NULL,
            product_targeting_expression VARCHAR(255) NULL
        );`, []);

        console.log(`Created "campaign_templates_data" table`);

        // console.log(`Seeding "campaign_templates_data" table`);
        // const seedTable = await client.sql`INSERT INTO campaign_templates_data (template_id) VALUES (0)`;
        // console.log(`Seeded "campaign_templates_data" table`);

        return createTable;

    } catch (error) {
        console.error('Error creating "campaign_templates_data" table.:', error);
        throw error;
    }
}

const createCampaignDataTable = async (client) => {
    try {

        // -- Create templates table
        const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS campaign_data (
            campaign_id INT, 
            key VARCHAR(255) NOT NULL,
            value VARCHAR(255) NOT NULL
        );`, []);

        console.log(`Created "campaign_data" table`);

        return createTable;

    } catch (error) {
        console.error('Error creating "campaign_data" table.:', error);
        throw error;
    }
}

export {
    createCampaignTemplateTable,
    createCampaignTable,
    createCampaignTemplateDataTable,
    createCampaignDataTable
}


