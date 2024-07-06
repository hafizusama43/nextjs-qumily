import { db } from "@vercel/postgres";
import pkg from 'pg';
const { Client } = pkg;


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
        client = db; // Use the imported Vercel Postgres client options
    }

    try {
        await client.connect();
        console.info(`Connected to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`);
        return client;
    } catch (err) {
        console.error(`Error connecting to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`, err);
        throw err;
    }
};

export { DbConnect };
