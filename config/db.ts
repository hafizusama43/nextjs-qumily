import { Client } from 'pg';
import { db } from '@vercel/postgres'; // Import the Vercel Postgres client

const DbConnect = async () => {
    

    let client;
    if (process.env.NEXT_ENV === 'development') {
        client = new Client({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'taskify',
        });
    } else {
        // Add prod db config here
        //  client = new Client({
        //     user: 'postgres',
        //     password: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     database: 'taskify',
        // });
    }

    try {
        await client.connect();
        console.log(`\x1b[34mConnected to ${process.env.NEXT_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database\x1b[0m`);
        return client;
    } catch (err) {
        console.error(`Error connecting to ${process.env.NEXT_ENV
            === 'development' ? 'local' : 'Vercel'} PostgreSQL database`, err);
        throw err;
    }
};

export default DbConnect; // Export the DbConnect function
