import { db } from "@vercel/postgres";
import pkg from 'pg';
const { Pool } = pkg; // Use Pool instead of Client

const PgSqlPool = async () => {
    let client;
    if (process.env.NEXT_ENV === 'development') {
        client = new Pool({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'taskify',
        });
    } else {
        client = db; // Use the imported Vercel Postgres pool
    }

    try {
        // Pool doesn't require a connect call, the query will handle it
        console.info(`Connected to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`);
        return client;
    } catch (err) {
        console.error(`Error connecting to ${process.env.NODE_ENV === 'development' ? 'local' : 'Vercel'} PostgreSQL database`, err);
        throw err;
    }
};

export { PgSqlPool };
