const { Client } = require('pg');
const { db } = require('@vercel/postgres');

const DbConnect = async () => {
    let client;
    if (process.env.NODE_ENV === 'development') {
        client = new Client({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'taskify',
        });
    } else {
        client = db; // Use the imported Vercel Postgres client options
    }

    try {
        await client.connect();
        console.log(`Connected to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`);
        return client;
    } catch (err) {
        console.error(`Error connecting to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`, err);
        throw err;
    }
};

module.exports = DbConnect;
